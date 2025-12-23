import { createSlice } from "@reduxjs/toolkit";

type SubscriptionState={
    subscriptionId:string|null;
    creatorId:string|null;
    planName:string|null;
    status:"ACTIVE"|"CANCELLED"|"EXPIRED"|null;
    usageLimit:number|null;
}

const initialState:SubscriptionState={
    subscriptionId:null,
    creatorId:null,
    planName:null,
    status:null,
    usageLimit:null,
}

const subscriptionSlice=createSlice({
    name:"subscription",
    initialState,
    reducers:{
        setSubscription(state,action){
            state.subscriptionId=action.payload.subscriptionId;
            state.creatorId=action.payload.creatorId;
            state.planName=action.payload.planName;
            state.status=action.payload.status;
            state.usageLimit=action.payload.usageLimit;
        },
        clearSubscription(state){
            state.subscriptionId=null;
            state.creatorId=null;
            state.planName=null;
            state.status=null;
            state.usageLimit=null;
        }
    }
})

export const {setSubscription,clearSubscription}=subscriptionSlice.actions
export const subscriptionReducer=subscriptionSlice.reducer