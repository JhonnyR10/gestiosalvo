import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../reducers/user-reducer";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
};

const bigReducer = combineReducers({ user: userReducer });

const persistedReducer = persistReducer(persistConfig, bigReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
