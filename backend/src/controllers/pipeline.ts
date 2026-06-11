import { type Request, type Response } from 'express';
import { ObjectId } from 'mongodb';
import {configureDatabase, getPipelineCollection} from '../config/database';
import { error } from 'node:console';

export const getAllPipelines = async (req: Request,res: Response) =>{
    try{
        const Cluster = getPipelineCollection();
        const rawData = await Cluster.find({}).toArray();

        const formattedData = rawData.map(item =>({
            pipelineId: item._id.toString(),
            name: item.name,
            targetService: item.targetService,
            schedule: item.schedule,
            isActive: item.isActive,
            ownerEmail: item.ownerEmail
        }));
        res.status(200).json(formattedData);
    }catch(error){
        res.status(500).json({error:"Failed to fetch data"});
    }
};

export const deletePipelineItem =  async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        if(!id || typeof id !=='string'){
            return res.status(400).json({error: "Invalid or malformed ID parameter"});
        }
        const myCluster = getPipelineCollection();
        const result = await myCluster.deleteOne({ _id: new ObjectId(id) });

        if(result.deletedCount === 0){
            res.status(404).json({error:"Pipeline is not found"});
        }

        res.status(200).json({message:"Pipeline hase been deleted successfully"});

    }catch(error){
        console.error("Delete failed:", error);
        res.status(500).json({message:"Failed to delete Pipeline from database"});
    }
};