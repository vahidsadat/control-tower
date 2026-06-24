import { Kafka, Admin, Producer, KafkaConfig, AdminConfig, Message, EachMessagePayload, ConsumerConfig } from "kafkajs";
import { EventEnvelop } from "../types/events";
import { Pipeline } from "../types/pipelineInfo";


class KafkaManager {
    private kafka: Kafka;
    private admin: Admin;
    private producer: Producer;
    private consumers: Map<string,any> = new Map();
    constructor(kafkaConfig: KafkaConfig, adminConfig?:AdminConfig) {
        this.kafka = new Kafka(kafkaConfig);
        this.admin = this.kafka.admin(adminConfig);
        this.producer = this.kafka.producer();
    }

    async connectAdmin(){
        try{
            console.log('Connecting Kafka Admin....');
            await this.admin.connect();
            console.log('Connect to Admin...')
        }catch(error){
            console.error("Can't connect to Admin ", error);
        }
    }

    async disconnectAdmin(){
        try{
            console.log('disConnecting Kafka Admin....');
            await this.admin.disconnect();
            console.log('disConnect from Admin...')
        }catch(error){
            console.error("Can't disconnect to Admin ", error);
        }
    }

    async createTopics(topicConfig: { 
        topic: string;
        numPartitions: number;
        replicationFactor: number;
    }[]) {
        try{
            const result = await this.admin.createTopics({
                topics: topicConfig,
                timeout: 300000,
                waitForLeaders: true,
            }
            );
            if (result){
                console.log("Kafka Topic create successfully");
            }else{
                console.log("Console log is already there");
            }
        }catch(error){
            console.error("There is a problem in creating Topic: ", error);

        }
    }

    async connectProducer(){
        try{
            console.log("Connecting to producer...");
            await this.producer.connect();
            console.log("Producer connected")
        }catch(error){
            console.error("Failed to connect to producer: ", error);
        }
    }

    async initializeProducer(topic: string, data: any){
        try{
            const msg: Message= {
                value: JSON.stringify(data)
            };
            await this.producer.send({
                topic: topic,
                messages: [msg]
            });
            console.log(`Message sent to the ${topic}`);
        }catch(error){
            console.error("Can't send message to topic: ", error);
        }
    }
    async disconnectProducer(){
        try{
            console.log("Disonnecting from producer...");
            await this.producer.disconnect();
            console.log("Producer disconnected")
        }catch(error){
            console.error("Failed to disconnect to producer: ", error);
        }
    }

    async initializeConsumer(topic: string, groupId: string, eachMessageHandler: (payload: EventEnvelop<Pipeline>) => Promise<void>){
        try {
            const consumerConfig : ConsumerConfig = { groupId: groupId};
            const consumer =  this.kafka.consumer(consumerConfig);
            console.log(`Connect to the consumer for topic: ${topic}`);
            await consumer.connect();
            console.log(`kafka consumer connected for topic: ${topic}`);
            await consumer.subscribe({topic:topic, fromBeginning: true});
            console.log(`Subscribed to topic ${topic}`);
            this.consumers.set(topic,consumer);
            await consumer.run({
                eachMessage: async (payload) => {
                    try {
                        if(!payload.message.value){
                            console.warn(`[Kafka Consumer] recieved an empty or null message`);
                            return;
                        }
                        const rawStringMessage = payload.message.value.toString();
                        const decodeedEnvelope: EventEnvelop<Pipeline> = JSON.parse(rawStringMessage);
                        await eachMessageHandler(decodeedEnvelope);
                    } catch (parsingError) {
                    console.error(`❌ Failed to parse incoming Kafka message on topic ${topic}:`, parsingError);
                }
                },
            });

        } catch (error) {
            console.error('Failed to initialize Kafka consumer:', error);
            
        }
    }

    async disconnectConsumer(topic: string){
        const consumer = this.consumers.get(topic);
        if (consumer) {
            try {
                console.log(`Disconnecting Kafka consumer for topic: ${topic}`);
                await consumer.disconnect();
                console.log(`Kafka consumer disconnected for topic: ${topic}`);
                this.consumers.delete(topic); // Remove the consumer from the map
            } catch (error) {
                console.error(`Failed to disconnect Kafka consumer for topic: ${topic}`, error);
            }
        } else {
            console.log(`No consumer found for topic: ${topic}`);
        }
    };
}
export const kafka_instnace = new KafkaManager({
    clientId: 'control-tower-backend',
    brokers: ['localhost:9092']
});