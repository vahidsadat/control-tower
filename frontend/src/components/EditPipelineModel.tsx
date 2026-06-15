import React, { useState } from "react";
import PipelineType from "../types/PipelineType";
import { updatePipeline } from "../utils/api";

interface EditPipelineModalProps{
    pipeline: PipelineType;
    onClose: ()=> void;
    setPipelines: React.Dispatch<React.SetStateAction<PipelineType[]>>
}


export default function EditPipelineModal( { pipeline, onClose, setPipelines} : EditPipelineModalProps){
    const [name, setName] = useState(pipeline.name);
    const [targetService, setTargetService] = useState(pipeline.targetService);
    const [schedule, setSchedule] = useState(pipeline.schedule);
    const [isActive, setIsActive] = useState(pipeline.isActive);
    const [ownerEmail, setOwnerEmail] = useState(pipeline.ownerEmail);
    const [isSaving, setIsSaving] = useState(false);


    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
    
    const updateFields = { name, targetService, schedule, isActive, ownerEmail};

    const change = await updatePipeline(pipeline.pipelineId, updateFields, setPipelines);
    setIsSaving(false);
    if(change) onClose();
    };
    return(
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 overflow-hidden transform scale-100 transition-all">
                <div className="bg-slate-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-900 font-roboto"> Modify configuration Parameters</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold text-xl">&times;</button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Pipeline Designatation Name</label>
                        <input
                            type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Target Cluster Infrastructure Service</label>
                        <input
                            type="text" value={targetService} onChange={(e) => setTargetService(e.target.value)} required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Execution Routine Sync Cron Schedule</label>
                        <input
                            type="text" value={schedule} onChange={(e) => setSchedule(e.target.value)} required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">Lead Supervisor Communication Email</label>
                        <input
                            type="text" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} required 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <input
                            type="checkbox" id="isActiveForm" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} 
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="isActiveForm" className="text-l font-medium text-gray-700 select-none"> Authorize Engine Operational Status Flag (Active)</label>
                    </div>
                    <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                        <button
                            type="button" onClick={onClose} disabled={isSaving}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit" disabled={isSaving}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 shadow-md shadow-blue-500/10 transition-colors disabled:opacity-50"
                        >
                            {isSaving ? "Saving Config..." : "Commit Parameters"}
                        </button>
                    </div>
                </form>

            </div>

        </div>
    )
}