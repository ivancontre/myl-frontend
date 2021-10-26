import { User } from '../auth/types';
import { Card } from '../card/types';

export const change = '[match] change';
export const changeOpponent = '[match] change opponent';
export const setActiveUsers = '[match] set active users';
export const setMatchId = '[match] set matchId';
export const setOpponentId = '[match] set opponentId';
export const resetMatchValues = '[match] reset match';

export type MatchState = {
    matchId: string | null;
    match: Dictionary<Card[] | []>;
    opponentMatch: Dictionary<Card[] | []>;
    opponentId: string | null;
    activeUsers: User[];
};

export type Dictionary<TValue> = {
    [id: string]: TValue;
};

export type DragCard = Partial<Card> & {
    index: number;
    zone: string;
};


type ChangeAction = {
    type: typeof change;
    payload: Dictionary<Card[] | []>;
};

type ChangeOpponentAction = {
    type: typeof changeOpponent;
    payload: Dictionary<Card[] | []>;
};


type MatchSetActiveUsers = {
    type: typeof setActiveUsers;
    payload: User[]
};

type MatchSetId = {
    type: typeof setMatchId,
    payload: string
};

type MatchSetOpponentId = {
    type: typeof setOpponentId,
    payload: string
};

type MatchReset = {
    type: typeof resetMatchValues
}

export type MatchActionTypes = ChangeAction | MatchSetActiveUsers | MatchSetId | MatchReset | MatchSetOpponentId | ChangeOpponentAction;