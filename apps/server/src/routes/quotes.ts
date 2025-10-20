import { FastifyInstance } from 'fastify'
import { generateAutoOffers } from '../services/auto-offers.js'
import { generateResidencialOffers } from '../services/residencial-offers.js'
import { QuoteRequest, QuoteResponse } from '../types/index.js'

export async function quotesRoutes(fastify: FastifyInstance) {
  fastify.post<{
    Params: { productType: string }
    Body: QuoteRequest
  }>('/api/quotes/:productType', async (request, reply) => {
    const { productType } = request.params
    const { cpf, data } = request.body

    if (!cpf || !data) {
      return reply.status(400).send({
        error: 'CPF e dados são obrigatórios',
      })
    }

    let offers

    try {
      if (productType === 'auto') {
        offers = await generateAutoOffers(cpf, data)
      } else if (productType === 'residencial') {
        offers = await generateResidencialOffers(cpf, data)
      } else {
        return reply.status(400).send({
          error: 'Tipo de produto inválido',
        })
      }

      const response: QuoteResponse = { offers }
      return reply.send(response)
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({
        error: 'Erro ao gerar cotações',
      })
    }
  })

  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() }
  })
}
