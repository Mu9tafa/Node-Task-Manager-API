const express = require("express");
const auth = require("../middleware/auth");
const User = require("../models/user");
const router = new express.Router();
const multer = require("multer");
const sharp = require("sharp");
const { sendWelcomeEmail, sendCancelationEmail } = require("../emails/account");

/******************************* Start rest api for users ********************************/

router.post("/users", async (req, res) => {
   const user = new User(req.body);
   try {
      await user.save();
      sendWelcomeEmail(user.email, user.name);
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
   } catch (error) {
      res.status(400).send(error);
   }
});

router.post("/users/login", async (req, res) => {
   try {
      const user = await User.findByCredentials(
         req.body.email,
         req.body.password
      );
      const token = await user.generateAuthToken();
      res.send({ user, token });
   } catch (error) {
      res.status(400).send(error);
   }
});

router.post("/users/logout", auth, async (req, res) => {
   try {
      req.user.tokens = req.user.tokens.filter(
         (token) => token.token !== req.token
      );
      await req.user.save();
      res.send();
   } catch (error) {
      res.status(500).send();
   }
});

router.post("/users/logoutAll", auth, async (req, res) => {
   try {
      req.user.tokens = [];
      await req.user.save();
      res.send();
   } catch (error) {
      res.status(500).send();
   }
});

router.get("/users/me", auth, async (req, res) => {
   res.send(req.user);
});

router.get("/users/:id", async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user) {
         return res.status(404).send();
      }
      res.send(user);
   } catch (error) {
      res.status(500).send(error);
   }
});

router.patch("/users/me", auth, async (req, res) => {
   const updates = Object.keys(req.body);
   const allowedUpdates = ["name", "email", "password", "age"];
   const isValid = updates.every((update) => allowedUpdates.includes(update));
   if (!isValid) {
      return res.status(400).send("Error: Invalid Update");
   }
   try {
      updates.forEach((update) => (req.user[update] = req.body[update]));
      await req.user.save();
      res.send(req.user);
   } catch (error) {
      res.status(500).send();
   }
});

router.delete("/users/me", auth, async (req, res) => {
   try {
      await req.user.remove();
      sendCancelationEmail(req.user.email, req.user.name);
      res.send(req.user);
   } catch (error) {
      res.status(500).send(error);
   }
});

const upload = multer({
   // dest: "./avatars",
   limits: {
      fileSize: 1000000,
   },
   fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/i)) {
         return cb(new Error("Please upload an image"));
      }
      cb(undefined, true);
   },
});

router.post(
   "/users/me/avatar",
   auth,
   upload.single("avatar"),
   async (req, res) => {
      const buffer = await sharp(req.file.buffer).resize().png().toBuffer();
      req.user.avatar = buffer;
      await req.user.save();
      res.send();
   },
   (error, req, res, next) => {
      res.status(400).send({ error: error.message });
   }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
   req.user.avatar = undefined;
   await req.user.save();
   res.send();
});

router.get("/users/:id/avatar", async (req, res) => {
   try {
      const user = await User.findById(req.params.id);
      if (!user || !user.avatar) {
         throw new Error();
      }
      res.set("Content-Type", "image/png");
      res.send(user.avatar);
   } catch (error) {
      res.status(404).send();
   }
});
module.exports = router;

/******************************** End rest api for users *********************************/
