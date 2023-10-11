import {
    apiAuthRoutes,
    apiAccountRoutes,
    apiCustomerRoutes,
    apiProductRoutes,
    apiInvoiceRoutes,
    homeRoutes,
    authRoutes,
    adminRoutes,
    productRoutes,
    errorAuthRoutes
} from './src/routes/index.js'

import Table from "ascii-table";

const table = new Table('Route Table');
const routes = (app) => {
    app.use('/api/account', apiAccountRoutes)
    app.use('/api/customer', apiCustomerRoutes)
    app.use('/api/product', apiProductRoutes)
    app.use('/api/invoice', apiInvoiceRoutes)
    app.use('/', homeRoutes)
    app.use('/auth', authRoutes)
    app.use('/admin', adminRoutes)
    app.use('/api/v1/auth', apiAuthRoutes)
    app.use('/product', productRoutes)
    app.use('/error', errorAuthRoutes)
    app.use((err, req, res, next) => {
        if (err.httpStatusCode === 404) return res.redirect('/error/404')
        if (err.httpStatusCode === 403) return res.redirect('/error/403')
        if (err.httpStatusCode === 500) return res.redirect('/error/500')
    })
    const COLUMNS_NAME = ['Root Path', 'Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [
        {name: '/api/v1/auth', route: apiAuthRoutes},
        {name: '/api/account', route: apiAccountRoutes},
        {name: '/api/customer', route: apiCustomerRoutes},
        {name: '/api/product', route: apiProductRoutes},
        {name: '/api/invoice', route: apiInvoiceRoutes},
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