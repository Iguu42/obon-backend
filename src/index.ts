import fastify, { FastifyInstance } from "fastify";
import { env } from '../src/env';
import cors from '@fastify/cors';
import { eventCategoryRoutes } from "./routes/eventCategory.routes";
import { producerRoutes } from "./routes/producer.routes";
import { assetRoutes } from "./routes/asset.routes";
import { purchaseOrderRoutes } from "./routes/purchaseOrder.routes";
import  {ticketTypeRoutes}  from "./routes/ticketType.routes";
import { eventRoutes } from "./routes/event.routes";
import { userRoutes } from "./routes/user.routes";
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
app.register(assetRoutes, {
    prefix: '/assets'
});
app.register(purchaseOrderRoutes,{
    prefix: '/purchaseorders'
});

app.register(ticketTypeRoutes,{
    prefix: '/ticketType'
});

app.register(eventRoutes,{
    prefix: '/events'
});

app.register(userRoutes,{
    prefix: '/users'
});

app.listen({ port: port || 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
});