import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { setCreator } from "@/store/slices/creatorSlice";
import { setSubscription } from "@/store/slices/subscriptionSlice";

export const loadCreatorContext=createAsyncThunk(
    "creator/loadContext",
    async(slug:string,{dispatch,rejectWithValue})=>{
        try{
            const res=await axios.get(`/api/creator/${slug}/context`)
            const {creator,subscription}=res.data

            //update the creator slice
            dispatch(setCreator({
                creatorId:creator.id,
                slug:creator.slug,
                name:creator.name,
                status:creator.status
            }));

            //update subscription slice
            if(subscription){
                dispatch(setSubscription({
                    subscriptionId:subscription.id,
                    creatorId:subscription.creatorId,
                    planName:subscription.planName,
                    status:subscription.status,
                    usageLimit:subscription.usageLimit
                }))
            }
            return true;
        }
        catch(err:any){
            return rejectWithValue("Failed to load creator context")
        }
    }
)