import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { HttpRequestMethods } from 'shared/const/http/HTTP_REQUEST_METHODS';
import { REDUCERS_PATHS } from 'shared/const/redux/REDUCERS_PATHS';
import { CALL_CREATE, CALL_GET_ITEM, USER_REGISTER } from 'shared/const/url/API_URLS';
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

        createCall: builder.mutation({
            query: (data) => ({
                url: CALL_CREATE,
                method: HttpRequestMethods.POST,
                body: data,
            }),
        }),

        getCall: builder.query({
            query: ({ id }: { id: string }) => ({
                url: CALL_GET_ITEM({ id }),
            }),
        }),
    }),
});

export const { useRegisterUserMutation, useCreateCallMutation, useGetCallQuery } = apiService;
