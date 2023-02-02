import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HttpRequestMethods } from 'shared/const/http/HTTP_REQUEST_METHODS';
import { REDUCERS_PATHS } from 'shared/const/redux/REDUCERS_PATHS';
import { USER_REGISTER } from 'shared/const/url/API_URLS';
import { publicConfig } from '../../publicConfig';

export const apiService = createApi({
    reducerPath: REDUCERS_PATHS.API_SERVICE,
    baseQuery: fetchBaseQuery({
        baseUrl: publicConfig.apiUrl,
        prepareHeaders: (headers) => {
            return headers;
        },
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url: USER_REGISTER,
                method: HttpRequestMethods.POST,
                body: data,
            }),
        }),
    }),
});

export const { useRegisterUserMutation } = apiService;
