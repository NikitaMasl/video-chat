import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { REDUCERS_PATHS } from 'shared/const/redux/REDUCERS_PATHS';

export const apiService = createApi({
    reducerPath: REDUCERS_PATHS.API_SERVICE,
    baseQuery: fetchBaseQuery({
        prepareHeaders: (headers) => {
            return headers;
        },
    }),
    endpoints: (builder) => ({}),
});
