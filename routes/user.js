const router = require("express").Router();
const User = require("../models/user");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  const newUserData = new User({
    username: req.body.username,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_ENC_SECRET_KEY
    ).toString(),
  });

  //saving the user info into the database
  try {
    const savedUser = await newUserData.save();
    const token = jwt.sign(
      { username: savedUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1ms" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 600000),
    });
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json(err);
  }
});
//Login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(401).json("Wrong username");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_ENC_SECRET_KEY
    );

    console.log("hashed password", hashedPassword);

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    console.log("original password", originalPassword);
    console.log("password", user.password);

    if (originalPassword !== req.body.password) {
      res.status(401).json("Wrong password");
    } else {
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1m" }
      );

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 60000),
      });
      res.status(200).json("User is Authenticated!");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
