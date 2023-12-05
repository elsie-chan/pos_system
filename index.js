import express from 'express';
import {connectDatabase, variables, config, configUpload, passportConfig} from './src/configuration/index.js';
import Table from 'ascii-table';
import routes from "./routes.js";

const table = new Table('App Configuration');

const app = express();

const resourceConfigStatus = config(app);

const passwordConfigStatus = passportConfig(app);

const dbConnectStatus = await connectDatabase();

const PORT = variables.PORT;

const URL = variables.URL;

const COLUMNS_NAME = ['Status', 'Message'];
table.setHeading(...COLUMNS_NAME);
table.addRow(resourceConfigStatus.status, resourceConfigStatus.message);
table.addRow(dbConnectStatus.status, dbConnectStatus.message);
table.addRow(passwordConfigStatus.status, passwordConfigStatus.message);
routes(app)
app.listen(PORT, () => {
    console.log(table.toString());
    console.log(`Server is running on ${URL + ":" + PORT}.`);
});
