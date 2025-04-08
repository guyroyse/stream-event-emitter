# Stream Event Emitter

This project demonstrates how to use [Redis streams](https://redis.io/docs/latest/develop/data-types/streams/) as a source for an [EventEmitter](https://nodejs.org/en/learn/asynchronous-work/the-nodejs-event-emitter) in Node.js. It uses the example of weather data that might have been gathered from a [weather station using a software-defined radio](https://github.com/guyroyse/plucking-data-from-thin-air). However, the source is weather data doesn't matter for this example as it only looks at the contents of a Redis stream.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system.
- **Redis**: A running Redis instance is required, as this project utilizes Redis Streams.

## Installation

```bash
git clone https://github.com/guyroyse/stream-event-emitter.git
cd stream-event-emitter
npm install
```

## Configuration

By default, the app connects to Redis at `localhost:6379`. If your Redis instance is hosted elsewhere or requires authentication, update the Redis connection settings in `main.ts`. Details on how to do this can be found in the Node Redis [docs](https://github.com/redis/node-redis/blob/master/docs/client-configuration.md).

## Running the Application

Start the application with:

```bash
npm run dev
```

The app will begin listening to a Redis stream for weather events and emit them. You'll see a few show up the are hard-coded in `main.ts`. You can add some manually to Redis by using [Redis Insight](https://redis.io/insight/) and running commands like:

```bash
> xadd weather:stream * temperature 78
> xadd weather:stream * humidity 62
> xadd weather:stream * temperature 77 humidity 63 windSpeed 12
```

I hope you find this example useful!
