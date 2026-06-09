import express from 'express';
import * as dotenv from 'dotenv';
import Data from './pipelineInfo'; 
import cors from 'cors';
import { MongoClient, ServerApiVersion } from 'mongodb';
dotenv.config();
const uri = process.env.MONGODB_URI

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://sadatvahid1372_db_user:<db_password>@cluster0.klqnets.mongodb.net/?appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
if (!uri){
    throw new Error('No connection to MongoDB');
}
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function startApp(){
    try{
        await client.connect();
        console.log("Successfully connect to DB");

        const myDB = client.db("control-tower");
        const myCluster = myDB.collection("Cluster0");
        const dataCount = await myCluster.countDocuments();
        if (dataCount ===0){
            const result = await myCluster.insertMany(Data);
            console.log(`Successfully inserted ${result.insertedCount} items.`);
        } else {
            console.log("Data already is there");
        }


        const app = express();
        app.use(cors());
        app.use(express.json());

        app.get('/api/pipeline', async (req,res) =>{
            try{
                const data = await myCluster.find({}).toArray();
                res.json(data);
            }catch(error){
                res.status(500).json({error:"Failed to fetch data"});
            }
        });
        const PORT = process.env.PORT ?? 5000;
        app.listen(PORT, () =>{
            console.log(`Control Tower backend active on http://localhost:${PORT}`);
        });
    } catch(error){
        console.error("Application failed to start:", error);
        await client.close();
    }
}

async function createExpressApp(){
    
}

startApp();

function main(){

}