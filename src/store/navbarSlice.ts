// src\store\navbarSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


interface navState {
    openNav: boolean
}

const initialState: navState = {
    openNav: false
}

const NavSlice = createSlice({
    name: "navbar",
    initialState,
    reducers: {
        setOpenNav: (state, action: PayloadAction<boolean>) => {
            console.log("setOpenNav called with:", action.payload);
            state.openNav = action.payload
        }
    }
})

export const { setOpenNav } = NavSlice.actions
export default NavSlice.reducer