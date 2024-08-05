import fastify, { FastifyInstance } from "fastify";
import { env } from '../src/env';
import cors from '@fastify/cors';
import { eventCategoryRoutes } from "./routes/eventCategory.routes";
import { producerRoutes } from "./routes/producer.routes";
const app: FastifyInstance = fastify({ logger: true });

const port = parseInt(env.PORT as string);

app.register(cors, {
    origin: [
        'http://localhost:5173',
        'https://site-de-eventos-frontend.vercel.app'
    ]
});
app.register(eventCategoryRoutes, {
    prefix: '/event/categories'
});
app.register(producerRoutes, {
    prefix: '/producers'
});

app.listen({ port: port || 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
});