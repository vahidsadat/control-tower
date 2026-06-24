import * as dotenv from 'dotenv';
import Data from '../types/pipelineInfo'; 
import { Collection, MongoClient, ServerApiVersion } from 'mongodb';
import { error } from 'node:console';
dotenv.config();
const uri = process.env.MONGODB_URI



if (!uri){
    throw new Error('No connection to MongoDB');
}
export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let pipelineCollection: Collection;

export async function configureDatabase(): Promise<void>{
    try{
        await client.connect();
        console.log("Successfully connect to DB");

        const myDB = client.db("control-tower");
        pipelineCollection = myDB.collection("Cluster0");
        const dataCount = await pipelineCollection.countDocuments();
        if (dataCount ===0){
            await pipelineCollection.insertMany(Data);
            console.log(`Successfully inserted items to database.`);
        };
        
    } catch(error){
        console.log("Can't Connect to Database", error);
        await client.close();
        process.exit(1);
    }
}

export function getPipelineCollection(): Collection {
    if(!pipelineCollection){
        throw new Error("Database is not initialized! call configurationDatabase first!");
    }
    return pipelineCollection
}