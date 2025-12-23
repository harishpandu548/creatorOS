import { createAsyncThunk } from "@reduxjs/toolkit";
import { setSubscription,clearSubscription } from "../slices/subscriptionSlice";
import axios from "axios";

export const refreshSubscription=createAsyncThunk(
    "subscription/refresh",
    async(slug:string,{dispatch,rejectWithValue})=>{
        try{
            const res=await axios.get(`/api/creator/${slug}/subscription`)
            const subscription=res.data
            if(!subscription){
                dispatch(clearSubscription())
                return null
            }
            dispatch(
                setSubscription({
                    subscriptionId:subscription.id,
                    creatorId:subscription.creatorId,
                    planName:subscription.planName,
                    status:subscription.status,
                    usageLimit:subscription.usageLimit,
                })
            )
            return true
        }
        catch(err:any){
            return rejectWithValue("Failed to refresh subscription")
        }
    }
)