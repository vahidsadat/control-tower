"use client";
import IconButton from "@mui/material/IconButton";
import PipelineType from "../types/PipelineType";
import DeleteIcon from '@mui/icons-material/Delete';
import { deletePipeline } from "../utils/api";
import { usePipelines } from "../hooks/usePipelines";
import EditIcon from '@mui/icons-material/Edit';
import cronstrue from 'cronstrue';
import { pipeline } from "stream";

interface PipelineTableProps {
  pipelines: PipelineType[];
  onEditClick: (pipeline: PipelineType) => void;
}

export default function PipelineTable( {pipelines, onEditClick} : PipelineTableProps){
  const { setPipelines } = usePipelines();
    return (
  <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200 w-full">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-gray-50 border-b border-gray-200">
          <th className="w-auto p-4 text-[15px] font-bold text-gray-500 uppercase" >Name</th>
          <th className="p-4 text-[15px] font-bold text-gray-500 uppercase" >Service</th>
          <th className="p-4 text-[15px] font-bold text-gray-500 uppercase" >schedule</th>
          <th className="p-4 text-[15px] font-bold text-gray-500 uppercase" >Status</th>
          <th className="p-4 text-[15px] font-bold text-gray-500 uppercase" >Owner</th>
          <th className="p-4 text-[15px] font-bold text-gray-500 uppercase text-center">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
          {pipelines.map((pipeline) => (
            <tr key={pipeline.pipelineId}>
            <td className="pl-3">{pipeline.name}</td>
            <td>{pipeline.targetService}</td>
            <td>{cronstrue.toString(pipeline.schedule)}</td>
            <td>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                pipeline.isActive ? 
                "bg-green-50 text-green-700 border border-green-200":
                "bg-red-50 text-red-700 border border-red-200"
              }`}>
                {pipeline.isActive ? " Active" : " Inactive"}
              </span>
            </td>
            <td>{pipeline.ownerEmail}</td>
            <td className="p-4 text-sm text-center">
              <div className="flex justify-center gap-1">
                <IconButton
                aria-label="edit"
                onClick={() => onEditClick(pipeline)}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-150">
                <EditIcon fontSize="small"/>
                </IconButton>
                <IconButton
                arial-label ="delete"
                onClick={() => deletePipeline(pipeline.pipelineId, setPipelines)}
                className="text-gray-400 hover:text-red-400 transition-colors duration-150"
                size="small">
                  <DeleteIcon fontSize="small"/>
                </IconButton>
              </div>
            </td>
            </tr>))}
      </tbody>
    </table>
  </div>
    );
}