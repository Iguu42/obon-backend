import fastify, { FastifyInstance } from "fastify";
import { env } from '../src/env';
import cors from '@fastify/cors';
import { eventCategoryRoutes } from "./routes/eventCategory.routes";
import { producerRoutes } from "./routes/producer.routes";
import { assetRoutes } from "./routes/asset.routes";
import { purchaseOrderRoutes } from "./routes/purchaseOrder.routes";
import { ticketTypeRoutes } from "./routes/ticketType.routes";
import { eventRoutes } from "./routes/event.routes";
import { userRoutes } from "./routes/user.routes";
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

const app: FastifyInstance = fastify({ logger: true });

const port = parseInt(env.PORT as string);

app.register(swagger, {
    swagger: {
        info: {
            title: 'Documentation: Obon API - Event Management',
            description: 'This is an `Event Management API Documentation` with all endpoints, requests and responses for testing and presenting how the backend works.',
            version: '1.0.0',
            termsOfService: 'http://swagger.io/terms/',
            contact: {
                name: 'Support Team',
                email: 'apisupportteam@obon.com',
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
        },
        host: 'localhost:3000',
        schemes: ['http', 'https'],
        tags: [
            { name: 'User', description: 'User related end-points' },
            { name: 'Producer', description: 'Producer related end-points' },
            { name: 'Event', description: 'Event related end-points' },
            { name: 'Event Category', description: 'Event Category related end-points' },
            { name: 'Asset', description: 'Asset related end-points' },
            { name: 'Purchase Order', description: 'Purchase Order related end-points' },
            { name: 'Ticket Type', description: 'Ticket Type related end-points' },
        ],
        definitions: {
            User: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    externalId: { type: 'string' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                },
            },
            Producer: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string' },
                    description: { type: 'string' },
                    imageUrl: { type: 'string' },
                },
            },
            Event: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    description: { type: 'string' },
                    capacity: { type: 'number' },
                    categoryId: { type: 'string' },
                    startDate: { type: 'string' },
                    endDate: { type: 'string' },
                    format: { type: 'string' },
                    producerId: { type: 'string' },
                    ageRating: { type: 'number' },
                    additionalDetails: { type: 'string' },
                    creatorId: { type: 'string' },
                    addressId: { type: 'string' },
                },
            },
            EventCategory: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    isActive: { type: 'boolean' },
                },
            },
            Asset: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    eventId: { type: 'string' },
                    type: { type: 'string' },
                    url: { type: 'string' },
                    description: { type: 'string' },
                },
            },
            PurchaseOrder: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userId: { type: 'string' },
                    eventId: { type: 'string' },
                    ticketTypes: { type: 'array', items: { $ref: '#/definitions/TicketTypeQuantity' } },
                    status: { type: 'string' },
                },
            },
            TicketType: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    eventId: { type: 'string' },
                    description: { type: 'string' },
                    price: { type: 'number' },
                    quantity: { type: 'number' },
                    quantityAvailablePerUser: { type: 'number' },
                    salesStartDate: { type: 'string' },
                    salesEndDate: { type: 'string' },
                    isActive: { type: 'boolean' },
                },
            },
            TicketTypeQuantity: {
                type: 'object',
                properties: {
                    ticketTypeId: { type: 'string' },
                    participantName: { type: 'string' },
                    participantEmail: { type: 'string' },
                },
            },
        },
        securityDefinitions: {
            apiKey: {
                type: 'apiKey',
                name: 'apiKey',
                in: 'header',
            },
        },
        paths: {
            '/users': {
                get: {
                    tags: ['User'],
                    summary: 'Get user by external id',
                    description: 'Return a single user',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'externalId',
                            in: 'path',
                            description: 'External ID of user to return',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    externalId: { type: 'string' },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    email: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Invalid ID supplied',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'User not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
                patch: {
                    tags: ['User'],
                    summary: 'Update user additional information',
                    description: 'Update an existing user with the specified role, cpf and phone',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'externalId',
                            in: 'path',
                            description: 'External ID of user to return',
                            required: true,
                            type: 'string',
                        },
                        {
                            in: 'body',
                            name: 'user',
                            description: 'User additional information that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    role: { type: 'string' },
                                    cpf: { type: 'string' },
                                    phone: { type: 'string' },
                                },
                            },
                        },
                    ],
                    responses: {
                        200: {
                            description: 'User updated successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    externalId: { type: 'string' },
                                    firstName: { type: 'string' },
                                    lastName: { type: 'string' },
                                    email: { type: 'string' },
                                    role: { type: 'string' },
                                    cpf: { type: 'string' },
                                    phone: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'User not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/users/events': {
                get: {
                    tags: ['User'],
                    summary: 'Get all events by user external id',
                    description: 'Return a list of events by user external id',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'externalId',
                            in: 'path',
                            description: 'External ID of user to return',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/Event',
                                },
                            },
                        },
                        400: {
                            description: 'Invalid ID supplied',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'User not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/producers': {
                post: {
                    tags: ['Producer'],
                    summary: 'Create a new producer',
                    description: 'Create a new producer with the specified name, email, description and imageUrl',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'producer',
                            description: 'Producer object that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    description: { type: 'string' },
                                    imageUrl: { type: 'string' },
                                },
                            },
                        },

                    ],
                    responses: {
                        201: {
                            description: 'Producer created successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    email: { type: 'string' },
                                    description: { type: 'string' },
                                    imageUrl: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Producer already exists',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
                get: {
                    tags: ['Producer'],
                    summary: 'Get all producers',
                    description: 'Return a list of producers',
                    produces: ['application/json'],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/Producer',
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/events': {
                post: {
                    tags: ['Event'],
                    summary: 'Create a new event',
                    description: 'Create a new event with the specified name, description, imageUrl, date, location, producerId and categoryId',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'event',
                            description: 'Event object that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    capacity: { type: 'number' },
                                    categoryId: { type: 'string' },
                                    startDate: { type: 'string' },
                                    endDate: { type: 'string' },
                                    format: { type: 'string' },
                                    producerId: { type: 'string' },
                                    ageRating: { type: 'number' },
                                    additionalDetails: { type: 'string' },
                                    creatorId: { type: 'string' },
                                    addressId: { type: 'string' },
                                },
                            },
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Event created successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    capacity: { type: 'number' },
                                    categoryId: { type: 'string' },
                                    startDate: { type: 'string' },
                                    endDate: { type: 'string' },
                                    format: { type: 'string' },
                                    producerId: { type: 'string' },
                                    ageRating: { type: 'number' },
                                    additionalDetails: { type: 'string' },
                                    creatorId: { type: 'string' },
                                    addressId: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/events/{id}': {
                get: {
                    tags: ['Event'],
                    summary: 'Get event by id',
                    description: 'Return a single event',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'id',
                            in: 'path',
                            description: 'ID of event to return',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    title: { type: 'string' },
                                    description: { type: 'string' },
                                    capacity: { type: 'number' },
                                    categoryId: { type: 'string' },
                                    startDate: { type: 'string' },
                                    endDate: { type: 'string' },
                                    format: { type: 'string' },
                                    producerId: { type: 'string' },
                                    ageRating: { type: 'number' },
                                    additionalDetails: { type: 'string' },
                                    creatorId: { type: 'string' },
                                    addressId: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Invalid ID supplied',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Event not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/events/recent': {
                get: {
                    tags: ['Event'],
                    summary: 'Get all recent events',
                    description: 'Return a list of recent events',
                    produces: ['application/json'],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/Event',
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Recent events not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/events/category/{categoryId}': {
                get: {
                    tags: ['Event'],
                    summary: 'Get events by category id',
                    description: 'Return a list of events by category id',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'categoryId',
                            in: 'path',
                            description: 'ID of category to return',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/Event',
                                },
                            },
                        },
                        400: {
                            description: 'Invalid ID supplied',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Category not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/events/creator/{creatorId}': {
                get: {
                    tags: ['Event'],
                    summary: 'Get events by creator id',
                    description: 'Return a list of events by creator id',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'creatorId',
                            in: 'path',
                            description: 'ID of creator to return',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/Event',
                                },
                            },
                        },
                        400: {
                            description: 'Invalid ID supplied',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Creator not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/event/categories': {
                post: {
                    tags: ['Event Category'],
                    summary: 'Create a new event category',
                    description: 'Create a new event category with the specified name and description',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'eventCategory',
                            description: 'Event Category object that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string' },
                                    isActive: { type: 'boolean' },
                                },
                            },
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Event Category created successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    name: { type: 'string' },
                                    isActive: { type: 'boolean' },
                                },
                            },
                        },
                        400: {
                            description: 'Event Category already exists',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
                get: {
                    tags: ['Event Category'],
                    summary: 'Get all event categories',
                    description: 'Return a list of event categories',
                    produces: ['application/json'],
                    responses: {
                        200: {
                            description: 'Successful operation',
                            schema: {
                                type: 'array',
                                items: {
                                    $ref: '#/definitions/EventCategory',
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/assets/upload': {
                post: {
                    tags: ['Asset'],
                    summary: 'Upload asset',
                    description: 'Upload an asset with the specified eventId, type, description and image',
                    consumes: ['multipart/form-data'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'eventId',
                            in: 'formData',
                            description: 'ID of event to return',
                            required: true,
                            type: 'string',
                        },
                        {
                            name: 'type',
                            in: 'formData',
                            description: 'Type of asset',
                            required: true,
                            type: 'string',
                        },
                        {
                            name: 'description',
                            in: 'formData',
                            description: 'Description of asset',
                            required: false,
                            type: 'string',
                        },
                        {
                            name: 'image',
                            in: 'formData',
                            description: 'Image to upload',
                            required: true,
                            type: 'file',
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Asset uploaded successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    eventId: { type: 'string' },
                                    type: { type: 'string' },
                                    url: { type: 'string' },
                                    description: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/assets/delete/{filename}': {
                delete: {
                    tags: ['Asset'],
                    summary: 'Delete asset',
                    description: 'Delete an asset by filename',
                    produces: ['application/json'],
                    parameters: [
                        {
                            name: 'filename',
                            in: 'path',
                            description: 'Filename of asset to delete',
                            required: true,
                            type: 'string',
                        },
                    ],
                    responses: {
                        204: {
                            description: 'Asset deleted successfully',
                        },
                        400: {
                            description: 'Bad request',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        404: {
                            description: 'Asset not found',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/purchaseorders': {
                post: {
                    tags: ['Purchase Order'],
                    summary: 'Create a new purchase order',
                    description: 'Create a new purchase order with the specified date, status, userId and eventId',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'purchaseOrder',
                            description: 'Purchase Order object that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    userId: { type: 'string' },
                                    eventId: { type: 'string' },
                                    ticketTypes: { type: 'array', items: { $ref: '#/definitions/TicketTypeQuantity' } },
                                    status: { type: 'string' },
                                },
                            },
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Purchase Order created successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    userId: { type: 'string' },
                                    eventId: { type: 'string' },
                                    ticketTypes: { type: 'array', items: { $ref: '#/definitions/TicketTypeQuantity' } },
                                    status: { type: 'string' },
                                },
                            },
                        },
                        400: {
                            description: 'Purchase Order already exists',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
            '/ticketType': {
                post: {
                    tags: ['Ticket Type'],
                    summary: 'Create a new ticket type',
                    description: 'Create a new ticket type with the specified description, price, quantity, quantityAvailablePerUser, salesStartDate, salesEndDate and isActive',
                    consumes: ['application/json'],
                    produces: ['application/json'],
                    parameters: [
                        {
                            in: 'body',
                            name: 'ticketType',
                            description: 'Ticket Type object that needs to be added to the store',
                            required: true,
                            schema: {
                                type: 'object',
                                properties: {
                                    eventId: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    quantity: { type: 'number' },
                                    quantityAvailablePerUser: { type: 'number' },
                                    salesStartDate: { type: 'string' },
                                    salesEndDate: { type: 'string' },
                                    isActive: { type: 'boolean' },
                                },
                            },
                        },
                    ],
                    responses: {
                        201: {
                            description: 'Ticket Type created successfully',
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'string' },
                                    eventId: { type: 'string' },
                                    description: { type: 'string' },
                                    price: { type: 'number' },
                                    quantity: { type: 'number' },
                                    quantityAvailablePerUser: { type: 'number' },
                                    salesStartDate: { type: 'string' },
                                    salesEndDate: { type: 'string' },
                                    isActive: { type: 'boolean' },
                                },
                            },
                        },
                        400: {
                            description: 'Ticket Type already exists',
                        },
                        401: {
                            description: 'Unauthorized',
                        },
                        500: {
                            description: 'Internal server error',
                        },
                    },
                },
            },
        },
    }
});

app.register(swaggerUi, {
    routePrefix: '/documentation-swagger/',
    uiConfig: {
        docExpansion: 'list',
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
        return { ...swaggerObject, host: request.headers.host };
    },
    transformSpecificationClone: true,
});
app.register(cors, {
    origin: [
        'http://localhost:5173',
        'https://site-de-eventos-frontend.vercel.app'
    ]
});
app.register(webhookClerk, {
    prefix:'/clerk'
})
app.register(eventCategoryRoutes, {
    prefix: '/event/categories'
});
app.register(producerRoutes, {
    prefix: '/producers'
});
app.register(assetRoutes, {
    prefix: '/assets'
});
app.register(purchaseOrderRoutes, {
    prefix: '/purchaseorders'
});

app.register(ticketTypeRoutes, {
    prefix: '/ticketType'
});

app.register(eventRoutes, {
    prefix: '/events'
});

app.register(userRoutes, {
    prefix: '/users'
});

app.listen({ port: port || 3000, host: '0.0.0.0' }, function (err, address) {
    if (err) {
        app.log.error(err)
        process.exit(1)
    }
    app.log.info(`server listening on ${address}`)
});