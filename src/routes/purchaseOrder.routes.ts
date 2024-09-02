import { FastifyInstance } from "fastify";
import { PurchaseOrderAndTicketsCreate } from "../interfaces/purchaseOrder.interface";
import { createQueues, getQueue } from "../lib/queue.lib";	

export async function purchaseOrderRoutes(fastify: FastifyInstance) {
  createQueues();

  fastify.post<{ Body: PurchaseOrderAndTicketsCreate }>('/', async (req, reply) => {
    try {
      const queue = getQueue('purchaseOrder');
      const data = await queue.add({ ...req.body });
      const result = await data.finished();
      reply.code(201).send(result);
    } catch (error) {
      console.error(error);

      if (error instanceof Error) {
        reply.code(400).send({ error: error.message });
      } else {
        reply.code(400).send({ error: 'An unknown error occurred' });
      }
    }
  });
}
