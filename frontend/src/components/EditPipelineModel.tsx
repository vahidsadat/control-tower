import React, { useState } from "react";
import PipelineType from "../types/PipelineType";
import { updatePipeline } from "../utils/api";

interface EditPipelineModalProps{
    pipeline: PipelineType;
    onClose: ()=> void;
    setPipeline: React.Dispatch<React.SetStateAction<PipelineType[]>>
}


export default async function EditPipelineModal( { pipeline, onClose, setPipeline} : EditPipelineModalProps){
    const [name, setName] = useState(pipeline.name);
}