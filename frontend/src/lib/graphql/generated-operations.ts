import client from "$lib/graphql/client";
import type {
        ApolloQueryResult, ObservableQuery, WatchQueryOptions
      } from "@apollo/client";
import { readable } from "svelte/store";
import type { Readable } from "svelte/store";
import gql from "graphql-tag"
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Cat = {
  __typename?: 'Cat';
  base64: Scalars['String'];
  height: Scalars['Float'];
  name: Scalars['String'];
  width: Scalars['Float'];
  x: Scalars['Float'];
  y: Scalars['Float'];
};

export type Query = {
  __typename?: 'Query';
  cat: Cat;
};


export type QueryCatArgs = {
  x: Scalars['Int'];
  y: Scalars['Int'];
};

export type CatQueryVariables = Exact<{
  x: Scalars['Int'];
  y: Scalars['Int'];
}>;


export type CatQuery = { __typename?: 'Query', cat: { __typename?: 'Cat', y: number, x: number, width: number, name: string, height: number, base64: string } };


export const CatDoc = gql`
    query Cat($x: Int!, $y: Int!) {
  cat(x: $x, y: $y) {
    y
    x
    width
    name
    height
    base64
  }
}
    `;
export const Cat = (
            options: Omit<
              WatchQueryOptions<CatQueryVariables>, 
              "query"
            >
          ): Readable<
            ApolloQueryResult<CatQuery> & {
              query: ObservableQuery<
                CatQuery,
                CatQueryVariables
              >;
            }
          > => {
            const q = client.watchQuery({
              query: CatDoc,
              ...options,
            });
            var result = readable<
              ApolloQueryResult<CatQuery> & {
                query: ObservableQuery<
                  CatQuery,
                  CatQueryVariables
                >;
              }
            >(
              { data: {} as any, loading: true, error: undefined, networkStatus: 1, query: q },
              (set) => {
                q.subscribe((v: any) => {
                  set({ ...v, query: q });
                });
              }
            );
            return result;
          }
        