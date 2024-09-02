import { FastifyInstance } from "fastify";
import { PurchaseOrderAndTicketsCreate } from "../interfaces/purchaseOrder.interface";
import { createQueues, getQueue } from "../lib/queue.lib";

export async function purchaseOrderRoutes(fastify: FastifyInstance) {
  createQueues();

  fastify.post<{ Body: PurchaseOrderAndTicketsCreate }>('/', async (req, reply) => {
    try {
      const queue = getQueue('purchaseOrder');
      console.log('Adding job to queue:', req.body);
      const job = await queue.add({ ...req.body });
      const result = await job.finished();
      reply.code(201).send(result);
    } catch (error) {
      console.error(error);
      reply.code(400).send({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  });
}
