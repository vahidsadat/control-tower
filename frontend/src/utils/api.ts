import React from "react";
import  PipelineType  from '../types/PipelineType';
const isServer = typeof window === 'undefined';

export const API_BASE_URL = isServer
  ? 'http://backend-api:5000/api/pipeline' 
  : 'http://localhost:5000/api/pipeline';

export async function deletePipeline (id:string, setPipelines:React.Dispatch<React.SetStateAction<PipelineType[]>>)
: Promise<void> {
    if(!confirm("Are you sure that you want to delete the Pipeline?")) return;

    try{
        const response = await fetch(`${API_BASE_URL}/${id}`, {method: 'DELETE'});
        if(!response.ok) throw new Error("Api transition prosseccing failed");

        setPipelines(prev => prev.filter(pipeline=> pipeline.pipelineId !==id));
    } catch(error){
        console.log("Transition error", error);
        alert("system can't execute the removal operation.");
    }
};

export async function resetPipelines() {
    if(window.confirm(" This will delete all the changes and reset the seed data. Continue?")){
        try{
            const response = await fetch(`${API_BASE_URL}/reset`, { method: 'POST'});
        }catch(error){
        console.log("Transition error", error);
        alert("system can't execute the removal operation.");
    }
    }
    
};

export async function updatePipeline (id:string, 
    updateFields: Partial<PipelineType>,
    setPipelines:React.Dispatch<React.SetStateAction<PipelineType[]>>)
    : Promise<boolean>{
    try{
        const response = await fetch(`${API_BASE_URL}/${id}`,
            {
                method: 'PATCH',
                headers:  { "Content-Type": "application/json" },
                body: JSON.stringify(updateFields)
            });
            if (response.ok){
                setPipelines((prev) => 
                prev.map((c) => (c.pipelineId ===id ? { ...c, ...updateFields} as PipelineType : c)));
            };
            return true;
        
    }catch(error){
        console.error("Update failed: ",error);
        return false;
    }
}