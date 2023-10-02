import {apiAuthRoutes, apiAccountRoutes, homeRoutes, authRoutes, adminRoutes} from './src/routes/index.js'
import Table from "ascii-table";
const table = new Table('Route Table');
const routes = (app) => {
    app.use('/api/v1/auth', apiAuthRoutes)
    app.use('/api/account', apiAccountRoutes)
    app.use('/', homeRoutes)
    app.use('/auth', authRoutes)
    app.use('/admin', adminRoutes)
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })

    const COLUMNS_NAME = ['Root Path', 'Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [
        { name: '/', route: homeRoutes },
        { name: '/api/v1/auth', route: apiAuthRoutes },
        { name: '/api/account', route: apiAccountRoutes },
        {name: '/auth', route: authRoutes},
        { name: '/admin', route: adminRoutes }
    ].forEach(router => {
        router.route.stack.forEach(layer => {
            if (layer.route) {
                const { path, methods } = layer.route;
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