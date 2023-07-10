import User from "../model/user.model.js";
import { tokenVerificationModel } from "../model/tokenVerificationModel.js";
import {
  generateEmail,
  generateOTP,
  mailTransport,
  responseEmail,
} from "../utils/sendEmail.js";
import {
  createUserValidator,
  loginUserValidator,
  userForgotPasswordValidator,
  userResetPasswordValidator,
} from "../validators/user.validator.js";
import { mongoIdValidator } from "../validators/mongoId.validator.js";
import { BadUserRequestError, NotFoundError } from "../error/error.js";
import { generateToken } from "../utils/jwt.utils.js";
import bcrypt from "bcrypt";
import { config } from "../config/index.js";

export default class UserController {
  static async createUser(req, res) {
    // Joi validation
    const { error, value } = createUserValidator.validate(req.body);
    if (error) throw error;
    // const emailExists = await User.find({ email: req.body.email })
    // if (emailExists.length > 0) throw new BadUserRequestError("An account with this email already exists.")
    // const usernameExists = await User.find({ username: req.body.username })
    // if (usernameExists.length > 0) throw new BadUserRequestError("An account with this username already exists.")
    const saltRounds = config.bycrypt_salt_round;
    const hashedPassword = bcrypt.hashSync(req.body.password, saltRounds);
    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    };

    const newUser = await User.create(user);
    res.status(200).json({
      message: "User created successfully",
      status: "Success",
      data: {
        user: newUser,
        access_token: generateToken(newUser),
      },
    });
  }

  static async findUser(req, res) {
    const { id } = req.query;
    const { error } = mongoIdValidator.validate(req.query);
    if (error) throw new BadUserRequestError("Please pass in a valid mongoId");
    // if(!id) throw new BadUserRequestError("Please pass in a valid userId in the request query")
    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User not found");

    res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data: {
        user,
      },
    });
  }

  // $or
  // $gt
  // $lt
  // $gte
  // $lte
  // $and

  static async loginUser(req, res) {
    const { error } = loginUserValidator.validate(req.body);
    if (error) throw error;
    if (!req.body?.username && !req.body?.email)
      throw new BadUserRequestError(
        "Please provide a username and email before you can login."
      );
    const user = await User.findOne({
      $or: [
        {
          email: req.body?.email,
        },
        {
          username: req.body?.username,
        },
      ],
    });
    if (!user) throw new BadUserRequestError("username, email does not exist");
    const hash = bcrypt.compareSync(req.body.password, user.password);
    if (!hash)
      throw new BadUserRequestError("username, email or password is wrong!");
    res.status(200).json({
      message: "User found successfully",
      status: "Success",
      data: {
        user,
        access_token: generateToken(user),
      },
    });
  }

  static async userForgotPassword(req, res) {
    const { error } = userForgotPasswordValidator.validate(req.body);
    if (error) throw error;

    const { email } = req.body;

    const user = await User.findOne({ email: req.body.email });

    if (!user) throw new BadUserRequestError("user not registered");

    const token = generateToken(user);

    const link = `http://localhost:3001/reset-password/${user._id}/${token}`;

    //await 
    mailTransport(user.email, "Password reset:", link);

    res.status(200).json({
      message: "Password reset link has been sent to your email account",
      link,
      token,
    });

    if (error) throw new BadUserRequestError("link not sent o your email");
  }

  static async userResetPassword(req, res) {
    const { error } = userResetPasswordValidator.validate(req.body);
    if (error) throw error;

    const user = await User.findById(req.params.userId);

    if (!user) return res.status(400).send("The id is invalid");

    const Token = tokenVerificationModel();

    const token = await Token.findOneAndUpdate({
      userId: user._id,
      token: req.params.token,
    });

    if (!token) throw new BadUserRequestError("Invalid link or token expired");
    res.render("reset password", { email: user.email });
    user.password = req.body.password;
    await user.save();
    await token.delete();

    res.status(200).json({
      message: "Password reset sucessfully.",
      status: "Success",
    });

    if (error)
      throw new BadUserRequestError(
        "An error occured while resetting password"
      );
  }
  //res.render('reset password', {email: user.email})
}




//https://server-inspireapp.onrender.com/api/v1/auth/google