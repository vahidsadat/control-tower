import { kafka_instnace } from "../config/kafka";
import { EventEnvelop } from "../types/events";
import pipelineArray, { Pipeline } from "../types/pipelineInfo";


export const seedInitialDataToKafka = async () => {
    try {
        console.log(`Seeding data, founding ${pipelineArray.length} pipelines`);
        for (const pipelineItem of pipelineArray){
            const kafkaEnvelope: EventEnvelop<Pipeline> = {
                action: "PIPELINE_CREATED",
                timestamp : new Date().toISOString(),
                data: pipelineItem
            }
            await kafka_instnace.initializeProducer("pipeline", kafkaEnvelope);
            console.log(`📦 Seeded pipeline event: ${pipelineItem.pipelineId}`);
        }
        console.log("🏁 All historical data has been successfully streamed to Kafka!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Critical error during Kafka data seeding:", error);
    }
};

seedInitialDataToKafka();