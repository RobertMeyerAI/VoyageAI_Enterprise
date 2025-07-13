import { ConnectorConfig } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Movie_Key {
  id: UUIDString;
  __typename?: 'Movie_Key';
}

export interface Rating_Key {
  userId: UUIDString;
  movieId: UUIDString;
  __typename?: 'Rating_Key';
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

export interface WatchlistEntry_Key {
  userId: UUIDString;
  movieId: UUIDString;
  __typename?: 'WatchlistEntry_Key';
}

