import {
    apiAuthRoutes,
    apiAccountRoutes,
    apiCustomerRoutes,
    apiProductRoutes,
    apiInvoiceRoutes,
    apiStatisticRoutes,
    homeRoutes,
    authRoutes,
    adminRoutes,
    productRoutes,
    errorAuthRoutes
} from './src/routes/index.js'
import { rateLimit } from 'express-rate-limit'

import Table from "ascii-table";
import {AuthMiddleware} from "./src/middleware/index.js";
import {Roles} from "./src/constants/roles.js";
import {rememberMe} from "./src/validator/index.js";

const table = new Table('Route Table');

const routes = (app) => {

    const rateLimiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })

// Apply the rate limiting middleware to all requests
    app.use(rateLimiter)
    app.use('/api/account', apiAccountRoutes)
    app.use('/api/customer', apiCustomerRoutes)
    app.use('/api/product', apiProductRoutes)
    app.use('/api/invoice', apiInvoiceRoutes)
    app.use('/api/statistic', apiStatisticRoutes)
    app.use('/', homeRoutes)
    app.use('/auth', authRoutes)
    app.use('/admin', AuthMiddleware.requireRole([Roles.ADMIN]), adminRoutes)
    app.use('/api/v1/auth', apiAuthRoutes)
    app.use('/product', productRoutes)
    app.use('/error', errorAuthRoutes)
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).render('error/error', {title: 500, error: "500", message: "Internal server error"})
    })
    app.use((req, res) => {
        res.status(404).render('error/error', {title: 404, error: "404", message: "Page not found"})
    })

    app.use((req, res, next) => {
        res.status(403).render('error/error', {title: 403, error: "403", message: "Forbidden"})
    })

    const COLUMNS_NAME = ['Root Path', 'Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [
        {name: '/api/v1/auth', route: apiAuthRoutes},
        {name: '/api/account', route: apiAccountRoutes},
        {name: '/api/customer', route: apiCustomerRoutes},
        {name: '/api/product', route: apiProductRoutes},
        {name: '/api/invoice', route: apiInvoiceRoutes},
        {name: '/api/statistic', route: apiStatisticRoutes},
        {name: '/', route: homeRoutes},
        {name: '/auth', route: authRoutes},
        {name: '/admin', route: adminRoutes},
        {name: '/product', route: productRoutes},
        {name: '/error', route: errorAuthRoutes}
    ].forEach(router => {
        router.route.stack.forEach(layer => {
            if (layer.route) {
                const {path, methods} = layer.route;
                Object.keys(methods).forEach(method => {
                    table.addRow(router.name, method.toUpperCase(), path);
                })
            }
        })

        //     set empty row
        table.addRow();
    })

    console.log(table.toString());
}


export default routes;