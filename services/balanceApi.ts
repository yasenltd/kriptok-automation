import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BalancesType } from '@/types';
import { Addresses, getAllBalances } from './balances';

export const balanceApi = createApi({
  reducerPath: 'balanceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['Balances'],
  endpoints: builder => ({
    getBalances: builder.query<BalancesType, Addresses>({
      queryFn: async addresses => {
        try {
          const balances = await getAllBalances(addresses);
          return { data: balances };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Balances'],
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetBalancesQuery, useLazyGetBalancesQuery } = balanceApi;
