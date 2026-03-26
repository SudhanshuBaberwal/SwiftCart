import { IProduct } from "@/model/product.model";
import { IUser } from "@/model/user.model";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUserData {
  allVendorData: IUser[];
  allProdutctsData: IProduct[];
}

const initialState: IUserData = {
  allVendorData: [],
  allProdutctsData: [],
};

const vendorSlice = createSlice({
  name: "vendor",
  initialState,
  reducers: {
    setAllVendorsData: (state, action: PayloadAction<IUser[]>) => {
      state.allVendorData = action.payload;
    },
    setAllProductsData: (state, action: PayloadAction<IProduct[]>) => {
      state.allProdutctsData = action.payload;
    },
  },
});

export const { setAllVendorsData, setAllProductsData } = vendorSlice.actions;
export default vendorSlice.reducer;
