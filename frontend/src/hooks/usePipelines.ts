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
        const response = await fetch(`${API_URL}/api/pipeline`);
        if(!response.ok){
          throw new Error(`Can't connect to URL`)
        }
        const data = await response.json();
        if (!data){
          throw new Error('No Data!');
        }
        setPipelines(data);
        return console.log("Frontend received:", data);
      } catch(err:any){
        console.error("Failed to load data: ",err);
        setError(err.message || "Something went wront");
      } finally {
        setLoading(false);
      }
    }
  fetchData();
  },[]);
  return { pipelines, setPipelines, loading, error};
};