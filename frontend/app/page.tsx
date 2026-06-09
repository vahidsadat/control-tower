"use client";
import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import CssBaseline from '@mui/material/CssBaseline';
import PipelineType from "./PipelineType";
import PipelineTable from "./components/PipelineTable";
import PipelineFilter from "./components/PipelineFilter";

export default function Dashboard(){

  const [pipelines, setPipelines] = useState<PipelineType[]>([]);


  const API_URL = 'http://localhost:5000';
  useEffect(() =>{
    const fetchData = async () => {
      try{
        const resoponce = await fetch(`http://localhost:5000/api/pipeline`);
        const data = await resoponce.json();
        if (!data){
          throw new Error('No Data!');
        }
        setPipelines(data);
        return console.log("Frontend received:", data);
      } catch(err){
        console.error("Failed to load datas: ",err);
      } 
    }
  fetchData();
  },[]);
  return (
    <main>
      <CssBaseline />
      <div>
        <h1> Control Tower</h1>
      </div>
      <div>
        <PipelineFilter />
      </div>
      <div>
        <PipelineTable pipelines = {pipelines}/>
    </div>
    </main>
  );
}

