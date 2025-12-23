import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slices/authSlice";
import { creatorReducer } from "./slices/creatorSlice";
import { subscriptionReducer } from "./slices/subscriptionSlice";
import { usageReducer } from "./slices/usageSlice";


export const store=configureStore({
    reducer:{
        auth:authReducer,
        creator:creatorReducer,
        subscription:subscriptionReducer,
        usage:usageReducer,
    }
})

// this line is for ask redux how does my entire looks like
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch
