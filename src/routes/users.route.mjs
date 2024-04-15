import { Router } from "express";
import { body, cookie, query } from "express-validator";
import {
  getAllUsers,
  getIndividualUser,
  postIndividualUser,
} from "../controllers/user-controller.mjs";

const ROUTE_ENDPOINT = {
  GET_ALL_USERS: "/api/users",
  GET_INDIVIDUAL_USER: "/api/user/:id",
  POST_INDIVIDUAL_USER: "/api/user",
};

const userRouter = Router();

userRouter.get(
  ROUTE_ENDPOINT.GET_ALL_USERS,

  cookie("name").matches("kishan").withMessage("must have valid cookie"),
  getAllUsers
);
userRouter.get(ROUTE_ENDPOINT.GET_INDIVIDUAL_USER, getIndividualUser);
userRouter.post(ROUTE_ENDPOINT.POST_INDIVIDUAL_USER, postIndividualUser);

export default userRouter;
