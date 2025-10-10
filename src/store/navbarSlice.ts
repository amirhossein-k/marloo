// src\store\navbarSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface navState {
    openNav: boolean
    loadingNav: boolean
}

const initialState: navState = {
    openNav: false,
    loadingNav: false
}

const NavSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        setOpenNav: (state, action: PayloadAction<boolean>) => {
            console.log("setOpenNav called with:", action.payload);
            state.openNav = action.payload
        },
        setLoadingNav: (state, action: PayloadAction<boolean>) => {
            console.log("setLoadingNav called with:", action.payload);
            state.loadingNav = action.payload
        }
    }
})

export const { setOpenNav, setLoadingNav } = NavSlice.actions
export default NavSlice.reducer