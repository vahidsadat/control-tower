import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {configureDatabase} from './src/config/database';
import { pipelineRoutes } from './src/routes/pipeline'

dotenv.config();


const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use('/api/pipeline', pipelineRoutes);


const PORT = process.env.PORT ?? 5000;
async function bootStrap(){
    await configureDatabase();
    app.listen(PORT, () =>{
    console.log(`Control Tower backend active on http://localhost:${PORT}`);
});
};

bootStrap();

