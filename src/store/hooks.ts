
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

//this line means instead of writing this everywhere useDispatch<AppDispatch>()
//we write useAppDispatch()
export const useAppDispatch=()=> useDispatch<AppDispatch>()
// Whenever i select state, i want TypeScript to know my full state shape
//so rootstate was{reducer:authreducer } like that
// so now this works safely const userId = useAppSelector(state => state.auth.userId);
export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector