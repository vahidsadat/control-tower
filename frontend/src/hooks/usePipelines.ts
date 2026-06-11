import { useEffect, useState } from "react";
import PipelineType from "../../app/PipelineType";

const API_URL = 'http://localhost:5000';

export function usePipeline(){
    const [pipelines, setPipelines] = useState<PipelineType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() =>{
    const fetchData = async () => {
      try{
        const resoponce = await fetch(`${API_URL}/api/pipeline`);
        const data = await resoponce.json();
        if (!data){
          throw new Error('No Data!');
        }
        setPipelines(data);
        return console.log("Frontend received:", data);
      } catch(err:any){
        console.error("Failed to load datas: ",err);
        setError(err.message || "Something went wront");
      } finally {
        setLoading(false);
      }
    }
  fetchData();
  },[]);
  return { pipelines, setPipelines, loading, error};
};

export async function deletePipeline (id:string){
  
    if(!confirm("Are you sure?")) return;
    await fetch(`${API_URL}/api/pipeline/${id}`, {method: 'DELETE'})
    usePipeline().setPipelines(prev => prev.filter(c=> c._id!==id))
}