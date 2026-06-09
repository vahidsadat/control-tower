import styled from "@emotion/styled";
import { useState } from "react";
const Input = styled.input`
    width: 70%;
    padding: 0.2rem;
    font-size: large;
`;
interface FilterState { 
  search: string;      
}
const INITIAL_FILTERS: FilterState = {
  search: "",
};

const PipelineFilter = () => {
    const [filter, setFilter] = useState<FilterState>(INITIAL_FILTERS)
    return(
    <Input 
    type="text"
    value={filter.search}
    onChange={(evt) => setFilter({search:evt.target.value})}
    />
    );
}

export default PipelineFilter;