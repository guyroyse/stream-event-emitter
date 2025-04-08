import { EventEmitter } from 'events'

export default class RedisPubSubEmitter extends EventEmitter {
  private redisClient: RedisClient
  private channel: string

  private constructor(redisClient: RedisClient, channel: string) {
    super()
    this.redisClient = redisClient
    this.channel = channel
  }

  static async create(redisClient: RedisClient, channel: string): Promise<RedisPubSubEmitter> {
    const client = (await redisClient
      .duplicate()
      .on('error', err => console.error('Redis Client Error', err))
      .connect()) as RedisClient

    return new RedisPubSubEmitter(client, channel)
  }

  async start() {
    await this.redisClient.subscribe(this.channel, (message: string) => {
      this.emit('message', message)
    })
  }
}
