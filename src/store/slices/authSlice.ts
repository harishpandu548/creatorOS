import { createSlice } from "@reduxjs/toolkit";

type AuthState={
    userId:string|null;
    name:string|null;
    email:string|null;
}
const initialState:AuthState={
    userId:null,
    name:null,
    email:null,
}

const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser(state,action){
            state.userId=action.payload.userId;
            state.name=action.payload.name;
            state.email=action.payload.email;
        },
        clearUser(state){
            state.userId=null;
            state.name=null;
            state.email=null;
        }
    }
})

export const {setUser,clearUser}=authSlice.actions
export const authReducer=authSlice.reducer