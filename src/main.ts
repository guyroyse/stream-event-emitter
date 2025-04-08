import { createClient } from 'redis'
import WeatherEmitter from './weather-emitter.js'

/* Connect to Redis. */
const redis = await createClient()
  .on('error', err => console.error('Redis Client Error', err))
  .connect()

/* Create a new WeatherEmitter and listen for events. */
const weatherEmitter = new WeatherEmitter(redis, 'weather:stream')

weatherEmitter.on('temperature', (event: any) => {
  console.log('Temperature is:', event)
})

weatherEmitter.on('humidity', (event: any) => {
  console.log('Humidity is:', event)
})

weatherEmitter.on('windSpeed', (event: any) => {
  console.log('Wind speed is:', event)
})

/* Start the WeatherEmitter. */
weatherEmitter.start()

/* NOTE: The call to Redis in weatherEmitter.start() happen after the calls to
   xAdd below unless we put in a delay. This is for demonstration purposes.
   Don't try this in prod. */

setTimeout(async () => {
  /* Add some weather events to the stream .*/
  await redis.xAdd('weather:stream', '*', { temperature: '79.1' })
  await redis.xAdd('weather:stream', '*', { humidity: '23.7' })
  await redis.xAdd('weather:stream', '*', { windSpeed: '10' })
  await redis.xAdd('weather:stream', '*', {
    temperature: '80.2',
    humidity: '23.5',
    windSpeed: '8'
  })
}, 1000)
