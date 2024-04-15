import { validationResult } from "express-validator";
import USERS_LIST from "../mock-data/users.mjs";
import responseJSON from "../models/user.response.mjs";
import { User } from "../mongoose/schemas/user.schema.mjs";
import { MongooseError, Schema } from "mongoose";
import { hashedPassword, comparePassword } from "../utils/helpers.mjs";
const SORT_TYPE = ["ASC", "DESC"];

export function getAllUsers(req, res) {
  const {
    query: { sort, limit },
  } = req;
  console.log("🚀 ~ getAllUsers ~ req:", req.session, req.session.id);
  const error = validationResult(req);
  // if (!error.isEmpty()) {
  //   res
  //     .status(400)
  //     .send(responseJSON(true, "Invalid Cookie", null, error.array()));
  //   res.end();
  // }

  if (!sort && !limit) {
    req.session.visited = true;
    res
      .status(200)
      .send(responseJSON(true, "Fetched Successfully", USERS_LIST));
  } else if (sort && limit) {
    res
      .status(200)
      .send(
        responseJSON(
          true,
          "Fetched Successfully",
          sort === "ASC"
            ? USERS_LIST.filter((_, index) => index < limit)
            : [...USERS_LIST].sort(() => -1).filter((_, index) => index < limit)
        )
      );
  } else if (sort) {
    if (SORT_TYPE.findIndex((item) => item === sort) < 0) {
      res.status(400).send(responseJSON(false, "Invalid sort value", null));
    } else {
      res
        .status(200)
        .send(
          responseJSON(
            true,
            "Fetched Successfully",
            sort === "ASC" ? USERS_LIST : [...USERS_LIST].sort(() => -1)
          )
        );
    }
  } else if (limit) {
    if (!isNaN(parseInt(limit))) {
      res.status(200).send(
        responseJSON(
          true,
          "Fetched Successfully",
          USERS_LIST.filter((_, index) => index < limit)
        )
      );
    } else {
      res.status(400).send(responseJSON(false, "Invalid limit value", null));
    }
  }
}
export function getIndividualUser(req, res) {
  const id = parseInt(req.params.id);
  console.log(
    "🚀 ~ getIndividualUser ~ req:",
    req.sessionStore.get(req.session.id, (error, sessionData) => {
      if (error) {
        console.log("🚀 ~ getIndividualUser ~ error:", error);
        throw error;
      }
      console.log("🚀 ~ req.sessionStore.get ~ sessionData:", sessionData);
    }),
    req.session.id
  );
  let user = {};
  if (!isNaN(id)) {
    user = USERS_LIST.find((item) => item.id === id);
    if (user?.id) {
      res.status(200).send(responseJSON(true, "Fetched Successfully", user));
    } else {
      res
        .status(404)
        .send(responseJSON(true, "User not found for id " + id, null));
    }
  } else {
    res.status(400).send(responseJSON(false, "Not a valid id", null));
  }
}
export async function postIndividualUser(req, res) {
  const body = req.body;

  const error = validationResult(req);

  if (!error.isEmpty())
    res
      .status(400)
      .send(responseJSON(false, "Invalid Body", null, error.array()));
  else {
    try {
      body.password = hashedPassword("" + body.password);

      const user = new User(body);
      const savedUser = await user.save();

      res.status(201).send(responseJSON(true, "Added Successfully", savedUser));
    } catch (err) {
      if (err.name === "MongoServerError")
        res.status(400).send(responseJSON(false, "Error", null, err.message));
    }
  }
}
