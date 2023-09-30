import authRoutes from "./src/routes/auth.route.js";
import Table from "ascii-table";
// import userRoute from "./src/routes/user.route.js";
// import homeRoute from "./src/routes/index.route.js";
// import artistRoute from "./src/routes/artist.route.js";
// import adminRoute from "./src/routes/admin.route.js";
//
// import playlistRoute from "./src/routes/playlist.route.js";
const table = new Table('Route Table');
const routes = (app) => {
    app.use('/api/v1/auth', authRoutes)
    // app.use('/api/user', userRoute)
    // app.use('/', homeRoute)
    // app.use("/api/artist", artistRoute);
    // app.use("/admin", adminRoute)
    // app.use('/api/playlist', playlistRoute)
    app.use((err, req, res, next) => {
        console.log(err);
        res.status(500).send(err.message);
    })

    const COLUMNS_NAME = ['Method', 'Path'];
    table.setHeading(...COLUMNS_NAME);

    [authRoutes].forEach(router => {
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