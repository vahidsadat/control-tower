import { useEffect, useState } from "react";
import PipelineType from "../types/PipelineType";

const API_URL = 'http://localhost:5000';

export function usePipelines(){
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