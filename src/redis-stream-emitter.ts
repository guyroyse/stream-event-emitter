import { EventEmitter } from 'events'

export default class RedisStreamEmitter extends EventEmitter {
  private redisClient: RedisClient
  private streamKey: string

  private constructor(redisClient: RedisClient, key: string) {
    super()
    this.redisClient = redisClient
    this.streamKey = key
  }

  static async create(redisClient: RedisClient, key: string): Promise<RedisStreamEmitter> {
    const client = (await redisClient
      .duplicate()
      .on('error', err => console.error('Redis Client Error', err))
      .connect()) as RedisClient

    return new RedisStreamEmitter(client, key)
  }

  async start() {
    let currentId = '$'

    while (true) {
      const streamRequests = [{ key: this.streamKey, id: currentId }]
      const options = { BLOCK: 5000, COUNT: 1 }
      const streamResponses = await this.redisClient.xRead(streamRequests, options)

      console.log('ping') // shouldn't this hit every 5 seconds?

      if (streamResponses === null || streamResponses.length === 0) continue

      const [streamResponse] = streamResponses
      for (const messageAndId of streamResponse.messages) {
        const { id, message } = messageAndId
        this.emit(message.type, { ...message })
        currentId = id
      }
    }
  }
}
