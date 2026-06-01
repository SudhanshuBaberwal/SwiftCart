import mongoose from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  phone: string;
  image?: string;
  role: "user" | "vendor" | "admin";

  // for vendor
  shopName?: string;
  shopAddress?: string;
  gstNumber?: string;
  isApproved?: boolean;
  verificationStatus: "pending" | "approved" | "rejected";
  requestAt: Date;
  approvedAt: Date;
  rejectedReason?: string;

  vendorProducts?: mongoose.Types.ObjectId[];
  orders?: mongoose.Types.ObjectId[];

  cart?: {
    product: mongoose.Types.ObjectId;
    quantity: number;
  }[];

  chats?: {
    with: mongoose.Types.ObjectId; // is user ke saath chat
    messages: {
      sender: mongoose.Types.ObjectId;
      text: string;
      createdAt: Date;
    }[];
  };

  creadtedAt?: Date;
  updatedAt?: Date;
}

const userSceham = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    image: {
      type: String,
    },
    phone: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "vendor", "admin"],
      default: "user",
    },
    shopName: {
      type: String,
    },
    shopAddress: {
      type: String,
    },
    gstNumber: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedAt: {
      type: Date,
    },
    requestAt: {
      type: Date,
    },
    rejectedReason: {
      type: String,
    },
    vendorProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Orders",
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    chats: [
      {
        with: {
          type: mongoose.Schema.Types.ObjectId,
          red: "User",
          required: true,
        },
        messages: [
          {
            sender: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
              required: true,
            },
            text: {
              type: String,
              required: true,
            },
            createdAt: {
              type: Date,
              default: Date.now(),
            },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSceham);
export default User;
