import { createClient } from 'redis'
import RedisStreamEmitter from './redis-stream-emitter.js'
import RedisListEmitter from './redis-list-emitter.js'

const redisClient = await createClient()
  .on('error', err => console.error('Redis Client Error', err))
  .connect()

const redisStreamEmitter = await RedisStreamEmitter.create(redisClient, 'mystream')
redisStreamEmitter.start()
redisStreamEmitter.on('bigfootSighting', (event: any) => {
  console.log('Received Bigfoot :', event)
})

const redisListEmitter = await RedisListEmitter.create(redisClient, 'mylist')
redisListEmitter.start()
redisListEmitter.on('message', (event: any) => {
  console.log('Received message :', event)
})
