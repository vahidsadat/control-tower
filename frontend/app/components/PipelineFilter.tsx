import styled from "@emotion/styled";
import { useState } from "react";
const Input = styled.input`
    width: 100%;
    padding: 0.2rem;
    font-size: large;
`;

interface PipelineFilterProps {
  searchTerm: string;
  onSearchChange: (newValue: string) => void;
}
const PipelineFilter = ({ searchTerm, onSearchChange}: PipelineFilterProps ) => {
    return(
    
    <div className="w-full">
      <Input 
        type="text"
        placeholder="Search name..."
        className="w-full p-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
    </div>
    );
}

export default PipelineFilter;