
import {
  createSlice
} from '@reduxjs/toolkit';
import { MMKV } from "react-native-mmkv";

const storage = new MMKV()

interface InitialState {

}

export const initialState: InitialState = {

};


export const user = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {

  },
  extraReducers(builder) {
    builder
    // .addCase(setTokenFirebase.fulfilled, (state, action) => {
    //   state.tokenFirebase = action.payload;
    // })
    // .addCase(setTokenFirebase.rejected, (state) => {
    //   state.tokenFirebase = "";
    // })
  },
});

// Reducer
export const { } = user.actions;
export default user.reducer;
