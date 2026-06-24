import pipeline from '../pipeline_registry.json' with { type: 'json'};

export interface Pipeline {
    pipelineId: string;
    name: string;
    targetService: string;
    schedule: string;
    isActive: boolean;
    ownerEmail: string;
}


function importDataFromJsonFile(){
    const pipeline_registry = pipeline as Pipeline[];
    return pipeline_registry;
}
export default importDataFromJsonFile()
