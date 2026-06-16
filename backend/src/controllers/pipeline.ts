import { type Request, type Response } from 'express';
import { ObjectId } from 'mongodb';
import {configureDatabase, getPipelineCollection} from '../config/database';
import { prisma } from '../config/prisma';

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
        const Cluster = getPipelineCollection();
        const result = await Cluster.deleteOne({ _id: new ObjectId(id) });

        if(result.deletedCount === 0){
            return res.status(404).json({error:"Pipeline is not found"});
        }

        res.status(200).json({message:"Pipeline hase been deleted successfully"});

    }catch(error){
        console.error("Delete failed:", error);
        res.status(500).json({message:"Failed to delete Pipeline from database"});
    }
};

export const resetPipelines = async(req: Request, res: Response) => {
    try{
    const Cluster = getPipelineCollection();
    const deletedResult = await Cluster.deleteMany({});
    console.log(`Cleared collection. Removed ${deletedResult.deletedCount} items.`)
    await configureDatabase();

    await prisma.pipeline.deleteMany({});
    const freshMongoData = await Cluster.find({}).toArray();


    for (const item of freshMongoData){
        await prisma.pipeline.create({
            data: {
                id: item._id.toString(),
                name: item.name,
                targetService: item.targetService || 'Unknown',
                schedule: item.schedule,
                isActive: item.isActive ?? true,
                ownerEmail: item.ownerEmail || "system@controltower.com"

            }
        });
    }
    console.log(`✅ Dual-Database Sync Complete! Populated ${freshMongoData.length} items into PostgreSQL.`);
    res.status(200).json({ 
      message: "Database successfully rolled back to default baseline states.",
      itemsRestored: freshMongoData.length 
    });}catch(error){
        console.error("Critical Reset System failure:", error);
        res.status(500).json({ error: "Failed to securely execute database reset routine." });
    }

};

export const updatePipelineItem = async(req: Request, res: Response) => {
    try{
        const {id} = req.params;
        if(!id || typeof id !=='string'){
            return res.status(400).json({error: "Invalid or malformed ID parameter"});
        }
        const { name,  schedule, isActive, targetService, ownerEmail} = req.body;

        const Cluster = getPipelineCollection();
        const result = await Cluster.updateOne(
           { _id: new ObjectId(id)},
           { $set: {name,  schedule, isActive, targetService, ownerEmail} }
        );

        const updatedPipeline = await prisma.pipeline.upsert({
            where: { id:id },
            update: {
                name,
                targetService,
                schedule,
                isActive,
                ownerEmail
            },
            create: {
                id: id,
                name,
                targetService,
                schedule,
                isActive,
                ownerEmail
            }
        });
        res.status(200).json({
            message: "Pipeline has been updated",
        data: updatedPipeline
    });
    } catch(error){
        res.status(500).json({message: "Update operation failed"});
    }
};
