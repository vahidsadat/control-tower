
export default interface PipelineType{
    pipelineId: string;
    name: string;
    targetService: string;
    schedule: string;
    isActive: boolean;
    ownerEmail: string;
}
