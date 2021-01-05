import { Schema, model, Document } from "mongoose";

import { config } from "../../config/index";

export interface IUser extends Document {
    email: string;
    password: string;
    username: string;
    state:boolean;
    created_at:string;
    updated_at:string    
  };
  
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_At",
      updatedAt: "update_At",
    },
    toJSON: { virtuals: true },
  }
);

export default model<IUser>(config.mongo.userCollection,userSchema);
