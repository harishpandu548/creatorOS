import {createSlice} from "@reduxjs/toolkit"

type ToolUsage={
    toolId:string;
    used:number;
    remaining:number;
};

type UsageState={
    tools:Record<string,ToolUsage>
}

const initialState:UsageState={
    tools:{}
}

const usageSlice=createSlice({
    name:"usage",
    initialState,
    reducers:{
        setUsageForTool(state,action){
            const {toolId,used,remaining}=action.payload;
            state.tools[toolId]={toolId,used,remaining};

        },
        //when a tool is runed increase its usage count to 1 and remaining count to -1
        incrementUsage(state,action){
            const {toolId}=action.payload;
            if(state.tools[toolId]){
                state.tools[toolId].used+=1;
                state.tools[toolId].remaining-=1;
            }
        },
        clearUsage(state){
            state.tools={}
        }
    }
})

export const {setUsageForTool,incrementUsage,clearUsage}=usageSlice.actions
export const usageReducer=usageSlice.reducer
