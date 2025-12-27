import { createSlice } from "@reduxjs/toolkit";

type CreatorState={
    creatorId:string|null;
    slug:string|null;
    name:string|null;
    status:"PENDING"|"APPROVED"|"BANNED"|null
}
const initialState:CreatorState={
    creatorId:null,
    slug:null,
    name:null,
    status:null,
}

const creatorSlice=createSlice({
    name:"creator",
    initialState,
    reducers:{
        setCreator(state,action){
            state.creatorId=action.payload.creatorId;
            state.slug=action.payload.slug;
            state.name=action.payload.name;
            state.status=action.payload.status;
        },
        clearCreator(state){
            state.creatorId=null;
            state.slug=null;
            state.name=null;
            state.status=null;
        }
    }
})

export const {setCreator,clearCreator}=creatorSlice.actions
export const creatorReducer=creatorSlice.reducer