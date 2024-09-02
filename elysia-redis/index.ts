import { Elysia, t } from 'elysia'
import { Redis } from 'ioredis'

// Create Redis client
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
})

// Define types for our request bodies and responses
type GetResponse = {
  key: string
  value: string | null
} | {
  error: string
}

type SetRequest = {
  key: string
  value: string
  ttl?: number
}

type SetResponse = {
  message: string
} | {
  error: string
}

// Create Elysia app
const app = new Elysia()

// GET endpoint to retrieve data from Redis
app.get('/get', async ({ query }): Promise<GetResponse> => {
  const { key } = query

  if (!key) {
    return { error: 'Key is required' }
  }

  try {
    const value = await redis.get(key)
    console.log(key, 'was read')
    return { key, value }
  } catch (error) {
    return { error: `Failed to get value: ${(error as Error).message}` }
  }
}, {
  query: t.Object({
    key: t.String()
  })
})

// POST endpoint to set data in Redis
app.post('/set', async ({ body }): Promise<SetResponse> => {
  const { key, value, ttl } = body

  if (!key || value === undefined) {
    return { error: 'Both key and value are required' }
  }

  try {
    if (ttl) {
      await redis.set(key, value, 'EX', ttl)
    } else {
      await redis.set(key, value)
    }
    console.log(key, 'was set')
    return { message: 'Value set successfully' }
  } catch (error) {
    return { error: `Failed to set value: ${(error as Error).message}` }
  }
}, {
  body: t.Object({
    key: t.String(),
    value: t.String(),
    ttl: t.Optional(t.Number())
  })
})

// Start the server
app.listen(process.env.PORT || 8200)

console.log(`Server is running on http://localhost:${process.env.PORT || 8200}`)