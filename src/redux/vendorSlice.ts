import { IUser } from "@/model/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserData {
  allVendorData: IUser[];
}

const initialState: IUserData = {
  allVendorData: [],
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setAllVendorsData: (state, action: PayloadAction<IUser[]>) => {
      state.allVendorData = action.payload;
    },
  },
});

export const { setAllVendorsData } = vendorSlice.actions;
export default vendorSlice.reducer;