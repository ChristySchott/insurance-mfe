import Fastify from 'fastify'
import cors from '@fastify/cors'
import { quotesRoutes } from './routes/quotes.js'

const fastify = Fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
})

await fastify.register(cors, {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
})

await fastify.register(quotesRoutes)

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3002
    const host = process.env.HOST || '0.0.0.0'

    await fastify.listen({ port, host })

    console.log('')
    console.log('🚀 Server is running!')
    console.log(`📍 http://localhost:${port}`)
    console.log('')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()
