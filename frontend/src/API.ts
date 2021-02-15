/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type LollyInput = {
  id?: string | null,
  c1?: string | null,
  c2?: string | null,
  c3?: string | null,
  rec?: string | null,
  sender?: string | null,
  message?: string | null,
  path?: string | null,
};

export type Event = {
  __typename: "Event",
  result?: string | null,
};

export type Lolly = {
  __typename: "Lolly",
  id?: string | null,
  c1?: string | null,
  c2?: string | null,
  c3?: string | null,
  rec?: string | null,
  sender?: string | null,
  message?: string | null,
  path?: string | null,
};

export type CreateLollyMutationVariables = {
  vlolly?: LollyInput | null,
};

export type CreateLollyMutation = {
  createLolly?:  {
    __typename: "Event",
    result?: string | null,
  } | null,
};

export type ListLollyQuery = {
  listLolly?:  Array< {
    __typename: "Lolly",
    id?: string | null,
    c1?: string | null,
    c2?: string | null,
    c3?: string | null,
    rec?: string | null,
    sender?: string | null,
    message?: string | null,
    path?: string | null,
  } | null > | null,
};
