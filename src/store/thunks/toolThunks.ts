import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { setUsageForTool } from "../slices/usageSlice";
import axios from "axios";

export const runTool=createAsyncThunk(
    "tools/runTool",
    async(
        {toolId}:{toolId:string},
        {getState,dispatch,rejectWithValue})=>{
        try {
            const state=getState() as RootState
            const slug=state.creator.slug
            if(!slug){
                return rejectWithValue("Creator context missing")
            }
            const res=await axios.post(`/api/creator/${slug}/tools/${toolId}/run`)
            const {used,remaining}=res.data

            dispatch(setUsageForTool({
                toolId,
                used,
                remaining
            }))
            return true;
        } catch (err:any) {
            return rejectWithValue(err.response?.data?.error||"Failed to run tool")
        }
    }
)