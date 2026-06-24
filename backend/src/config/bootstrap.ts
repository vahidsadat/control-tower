import  express  from "express";
import {configureDatabase, getPipelineCollection} from '../config/database';
import { savePipelineToPostgres } from "./workers/pipelineWorker";
import { kafka_instnace } from "./kafka";

const app = express()

const bootStrapApplication = async () => {
    try {
        console.log(" Starting Control Tower Application Setup...");

        await configureDatabase();

        await kafka_instnace.connectAdmin();
        await kafka_instnace.createTopics([{
            topic: "pipeline", numPartitions: 1, replicationFactor: 1
        }]);

        await kafka_instnace.disconnectAdmin();
        await kafka_instnace.connectProducer();
        await kafka_instnace.initializeConsumer(
            "pipeline", 
             "pipeline-sync-group",
             savePipelineToPostgres
        );
        app.listen(3000, () => {
            console.log("🚀 Server actively listening on port 3000!");
        });
    } catch (criticalError) {
        console.error("❌ Critical System Boot Failure! Shutting down...", criticalError);
        process.exit(1);
        
    }
};

bootStrapApplication();