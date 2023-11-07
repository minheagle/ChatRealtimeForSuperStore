import User from "../models/userModel.js";

export const register = async (req, res, next) => {
  try {
    const { username } = req.body;
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) throw new Error("Username already used");
    const user = await User.create({
      username,
    });
    return res.json({ status: true, user });
  } catch (ex) {
    return res.status(400).json({ msg: ex.message, status: false });
  }
};

export const getDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "username",
      "avatarImage",
      "_id",
    ]);
    return res.json(users);
  } catch (ex) {
    next(ex);
  }
};

export const setUserName = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const username = req.body.username;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        username,
      },
      { new: true }
    );
    return res.json({
      userName: userData.username,
    });
  } catch (ex) {
    next(ex);
  }
};

export const setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      { new: true }
    );
    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (ex) {
    next(ex);
  }
};
