/**
 * Hooks personnalisés pour utiliser Redux
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState } from "./rootReducer";
import type { AppDispatch } from "./store";

/**
 * Hook pour utiliser le dispatch avec les types corrects
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook pour utiliser le selector avec les types corrects
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
