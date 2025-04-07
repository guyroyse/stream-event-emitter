import { createClient, createCluster } from 'redis'

declare global {
  type RedisClient = ReturnType<typeof createClient> | ReturnType<typeof createCluster>
}

export {}
