import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export interface initialState {
    page: number,
    min: number,
    max: number,
    sort: string,
    category: string,
    count: number,
    offer: number
}
const initialState: initialState = {
    page: 1,
    min: 0,
    max: 100000000,
    sort: 'new',
    category: '',
    count: 1,
    offer: 1
}
const UrlFilterSlice = createSlice({
    name: "urlfilter",
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload

        },
        setMin: (state, action: PayloadAction<number>) => {
            state.min = action.payload
        },
        setMax: (state, action: PayloadAction<number>) => {
            state.max = action.payload
        },
        setSort: (state, action: PayloadAction<string>) => {
            state.sort = action.payload
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload
        },
        setCount: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        setOffer: (state, action: PayloadAction<number>) => {
            state.count = action.payload
        },
        /** Sync with URL on startup */
        hydrateFromUrl: (state, action: PayloadAction<Partial<initialState>>) => {
            return { ...state, ...action.payload };
        },
    }
})

export const { setCategory, setMax, setMin, setPage, setSort, hydrateFromUrl, setCount, setOffer } = UrlFilterSlice.actions
export default UrlFilterSlice.reducer