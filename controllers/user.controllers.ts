import { NextFunction, Request, Response } from "express";
import { signJwtToken } from "../lib/jwt";
import OpError from "../lib/operational-error";
import { User } from "../models";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return next(new OpError(400, "Name, email, and password fields are required for user sign up."));
    }

    const user = await User.create({ name, email, password });

    res.status(201).json({
      status: "Success",
      message: "Your account has been created successfully. Please sign in with your email and password.",
    });
  } catch (error) {
    next(error);
  }
};

const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new OpError(400, "Email and password fields are required for user authentication."));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.isPasswordValid(password))) {
      return next(new OpError(401, "Invalid email or password."));
    }
    user.password = "";

    const accessToken = signJwtToken({ id: user._id.toString() });

    res.status(200).json({
      status: "Success",
      data: {
        user,
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = res.locals.authenticatedUser.id;
    const user = await User.findOne({ _id: userId }).populate({ path: "orders", populate: { path: "bakery" } });
    if (!user) {
      return next(new OpError(404, "No user found with this id."));
    }

    res.status(200).json({
      status: "Success",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export { authenticateUser, createUser, getUser };
