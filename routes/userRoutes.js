const express = require("express");
const userController = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");

const userRouter = express.Router();

userRouter.route("/signup").post(authController.signUp);
userRouter.route("/login").post(authController.login);
userRouter.route("/forgetPassword").post(authController.forgetPassword);
userRouter.route("/resetPassword/:token").patch(authController.resetPassword);

//protect the routes bellow by checking for authorization
userRouter.use(authController.protect);

userRouter.route("/me").get(userController.getMe, userController.getUser);
userRouter.route("/updateMe").patch(userController.updateMe);
userRouter.route("/deleteMe").patch(userController.deleteMe);
userRouter.route("/updatePassword").patch(authController.updatePassword);

//only the admin can access the routes bellow
userRouter.use(authController.restrictTo("admin"));

userRouter.route("/").get(userController.getAllUsers);
userRouter
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
