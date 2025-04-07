import { EventEmitter } from 'events'

export default class RedisListEmitter extends EventEmitter {
  private redisClient: RedisClient
  private listKey: string

  private constructor(redisClient: RedisClient, key: string) {
    super()
    this.redisClient = redisClient
    this.listKey = key
  }

  static async create(redisClient: RedisClient, key: string): Promise<RedisListEmitter> {
    const client = (await redisClient
      .duplicate()
      .on('error', err => console.error('Redis Client Error', err))
      .connect()) as RedisClient

    return new RedisListEmitter(client, key)
  }

  async start() {
    while (true) {
      const listResponse = await this.redisClient.brPop(this.listKey, 5000)
      console.log('ping') // shouldn't this hit every 5 seconds?
      console.log('listResponses', listResponse)
    }
  }
}
