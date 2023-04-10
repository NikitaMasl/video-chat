import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { apiService } from './api/apiService';
import textChatReducer from './slices/TextChatSlice';

const rootReducer = combineReducers({
    [textChatReducer.name]: textChatReducer,
    [apiService.reducerPath]: apiService.reducer,
});

export const store = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiService.middleware),
    });
};

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof store>;
export type AppDispatch = AppStore['dispatch'];
