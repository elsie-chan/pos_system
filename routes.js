import authRoutes from "./src/routes/auth.route.js";
import Table from "ascii-table";
import accountRoutes from "./src/routes/account.route.js";
import homeRoutes from "./src/routes/home.route.js";
const table = new Table('Route Table');
const routes = (app) => {
    app.use('/api/v1/auth', authRoutes)
    app.use('/api/account', accountRoutes)
    app.use('/', homeRoutes)
    // app.use("/api/artist", artistRoute);
    // app.use("/admin", adminRoute)
    // app.use('/api/playlist', playlistRoute)
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })

    const COLUMNS_NAME = ['Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [authRoutes, accountRoutes,homeRoutes].forEach(router => {
        router.stack.forEach(layer => {
            if (layer.route) {
                const {path, methods} = layer.route;
                Object.keys(methods).forEach(method => {
                    table.addRow(method.toUpperCase(), path);
                })
            }
        })
    })

    console.log(table.toString());
}


export default routes;