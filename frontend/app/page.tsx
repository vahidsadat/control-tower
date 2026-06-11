"use client";
import { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import PipelineTable from "./components/PipelineTable";
import PipelineFilter from "./components/PipelineFilter";
import { usePipeline } from "@/src/hooks/usePipelines";

export default function Dashboard(){

  const [searchTerm, setSearchTerm] = useState<string>("");


  const filteredPipelines = usePipeline().pipelines.filter((pipeline) => {
    return pipeline.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  return (
    <main className="pb-8">
      <CssBaseline />
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="pt-5">
          <h1 className="text-3xl font-bold font-roboto"> Control Tower</h1>
        </div>
        <div>
          <PipelineFilter 
            searchTerm = {searchTerm}
            onSearchChange = {setSearchTerm}
          />
          <PipelineTable pipelines = {filteredPipelines}/>
        </div>
      </div>
    </main>
  );
}

