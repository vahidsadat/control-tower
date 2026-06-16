import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import {configureDatabase} from './config/database';
import pipelineRoutes  from './routes/pipeline'

dotenv.config();


const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use('/api/pipeline', pipelineRoutes);


const PORT = process.env.PORT ?? 5000;
async function bootStrap(){
    await configureDatabase();
    // 💡 FIXED: Added '0.0.0.0' interface binding string explicitly
    app.listen(Number(PORT), '0.0.0.0', () => {
        console.log(`Control Tower backend active on port ${PORT}`);
    });
};

bootStrap();

