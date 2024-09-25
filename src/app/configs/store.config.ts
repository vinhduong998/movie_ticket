import { UnknownAction, configureStore, ThunkAction } from '@reduxjs/toolkit';
import reducer, { RootReducer } from 'app/store';
import { MMKV } from "react-native-mmkv";
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import logger from "redux-logger";
import { persistReducer, persistStore, Storage } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';

const storage = new MMKV()

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: (key) => {
    const value = storage.getString(key)
    return Promise.resolve(value)
  },
  removeItem: (key) => {
    storage.delete(key)
    return Promise.resolve()
  },
}

const persistConfig = {
  key: "root",
  storage: reduxStorage,
  blacklist: [],
  whitelist: ["user", "system", "home"],
  stateReconciler: autoMergeLevel2
};

 const persistedReducer = persistReducer<RootReducer>(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      immutableCheck: {warnAfter: 50},
      serializableCheck: false,
    })
    // .concat(logger) // if want to logger redux action
  }
});

export default function getStore() {
  return store;
};

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
export const useAppSelector: TypedUseSelectorHook<IRootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, IRootState, unknown, UnknownAction>;
