"use client";
import { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import PipelineTable from "../components/PipelineTable";
import PipelineFilter from "../components/PipelineFilter";
import { usePipelines } from "@/src/hooks/usePipelines";
import Button from '@mui/material/Button';
import { resetPipelines } from '../utils/api';
import PipelineType from "../types/PipelineType";
import EditPipelineModal from "../components/EditPipelineModel";

export default function Dashboard(){

  const [editingPipeline, setEditingPipeline] = useState<PipelineType | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { pipelines, setPipelines, loading, error } = usePipelines();


  const filteredPipelines = pipelines.filter((pipeline) => {
    return pipeline.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  if (loading) return <div className="p-12 text-center text-lg font-medium text-gray-500 animate-pulse font-roboto">Synchronizing Control Tower Node...</div>;
  if (error) return <div className="p-12 text-center text-lg font-semibold text-red-500 font-roboto">Cluster Synch Failure: {error}</div>;
  return (
    <main className="pb-8">
      <CssBaseline />
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        <div className="pt-5">
          <h1 className="text-3xl font-bold font-roboto"> Control Tower</h1>
        </div>
        <div>
        <div className="flex flex-row gap-4">
          <PipelineFilter 
            searchTerm = {searchTerm}
            onSearchChange = {setSearchTerm}
          />
          <Button variant="contained" size="small" color="error"
          onClick={resetPipelines}>
            Reset
          </Button>
          </div>
          <PipelineTable pipelines = {filteredPipelines} onEditClick={setEditingPipeline}/>
        </div>
      </div>
      {editingPipeline && (
        <EditPipelineModal 
        pipeline={editingPipeline}
        onClose={() => setEditingPipeline(null)} //wipes state to close popup panel
        setPipelines={setPipelines}
        />
      )}
    </main>
  );
}

