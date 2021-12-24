export const typesCardLoad = '[typesCard] Load';
export const frecuenciesCardLoad = '[frecuenciesCard] Load';
export const racesCardLoad = '[racesCard] Load';
export const editionsCardLoad = '[editionsCard] Load';
export const erasCardLoad = '[erasCard] Load';
export const resetDescription = '[description] Rest';

export type DescriptionState = {
    types: TypeCard[];
    frecuencies: FrecuencyCard[];
    races: RaceCard[];
    editions: EditionCard[];
    eras: EraCard[]
};

export type TypeCard = {
    id: string;
    name: string;
};

export type FrecuencyCard = {
    id: string;
    name: string;
};

export type RaceCard = {
    id: string;
    name: string;
    edition: string;
};

export type EditionCard = {
    id: string;
    name: string;
    races: RaceCard[];
};

export type EraCard = {
    id: string;
    name: string;
    editions: EditionCard[];
};


type TypeLoadAction = {
    type: typeof typesCardLoad,
    payload: TypeCard[]
};

type FrecuencyCardLoadAction = {
    type: typeof frecuenciesCardLoad,
    payload: FrecuencyCard[]
};

type RaceCardLoadAction = {
    type: typeof racesCardLoad,
    payload: RaceCard[]
};

type EditionCardLoadAction = {
    type: typeof editionsCardLoad,
    payload: EditionCard[]
};

type EraCardLoadAction = {
    type: typeof erasCardLoad,
    payload: EraCard[]
};

type ResetDescriptionAction = {
    type: typeof resetDescription;
};

export type DescriptionCardActionTypes = TypeLoadAction | FrecuencyCardLoadAction | RaceCardLoadAction | EditionCardLoadAction | EraCardLoadAction | ResetDescriptionAction;