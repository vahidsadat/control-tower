
export interface EventEnvelop<T>{
    action: "PIPELINE_CREATED" | "PIPELINE_UPDATED" | "PIPELINE_DELETED";
    timestamp: string;
    data: T | {pipelineId:string};
}  