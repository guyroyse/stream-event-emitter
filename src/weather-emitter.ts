import { EventEmitter } from 'events'

export default class WeatherEmitter extends EventEmitter {
  private redis: RedisClient
  private key: string
  private running = false

  constructor(redis: RedisClient, key: string) {
    super()
    this.redis = redis.duplicate() // Duplicate the client to avoid blocking the main client
    this.key = key
  }

  async start() {
    /* Duplicated clients are not automatically connected. */
    await this.redis.connect()

    /* Set the running flag to true. This is used to stop the stream when we
       call stop(). */
    this.running = true

    /* Wait for a new item to be added to the stream. */
    let currentId = '$'

    while (this.running) {
      /* Get the next item off the stream. */
      const streamRequests = [{ key: this.key, id: currentId }]
      const options = { BLOCK: 5000, COUNT: 1 }
      const streamResponses = await this.redis.xRead(streamRequests, options)

      /* If nothing is returned, loop again. */
      if (streamResponses === null || streamResponses.length === 0) continue

      /* There should be one and only one stream response and message. */
      const [streamResponse] = streamResponses
      const [messageAndId] = streamResponse.messages

      /* Destructure the fields we need. */
      const { id, message } = messageAndId

      /* For every field, emit and event */
      for (const [key, value] of Object.entries(message)) {
        const event = key
        const data = parseFloat(value)
        this.emit(event, data)
      }

      /* Update the message id for the next iteration. */
      currentId = id
    }
  }

  async stop() {
    if (this.running === false) return // Already stopped or never started
    this.running = false
    await this.redis.quit()
  }
}
