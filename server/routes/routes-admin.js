const express = require("express");
const router = express.Router();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

const service = require("../services/service");
const accountLayout = "../views/layouts/account";
const forbiddenLayout = "../views/layouts/forbidden";
const adminLayout = "../views/layouts/admin";

router.get("/login", async (req, res) => {
  res.render("admin/login", { layout: accountLayout });
});

router.get("/register", async (req, res) => {
  res.render("admin/register", { layout: accountLayout });
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await service.getUserByUsername(username);
    if (!user)
      return res.status(401).render("partials/message-invalid-credentials", {
        layout: forbiddenLayout,
      });

    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).render("partials/message-invalid-credentials", {
        layout: forbiddenLayout,
      });

    const token = jwt.sign({ userId: user.id, isAdmin: true }, jwtSecret, {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error logging in:", error);
    res
      .status(500)
      .render("partials/message-internal-error", { layout: forbiddenLayout });
  }
});

function isAdmin(req, res, next) {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).render("partials/message-unauthorized-session", {
      layout: forbiddenLayout,
    });

  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.isAdmin) next();
    else
      return res.status(403).render("partials/message-unauthorized-action", {
        layout: forbiddenLayout,
      });
  } catch (error) {
    return res.status(401).render("partials/message-unauthorized-session", {
      layout: forbiddenLayout,
    });
  }
}

router.get("/dashboard", isAdmin, async (req, res) => {
  const games = await service.getAllGames();
  res.render("admin/dashboard", { games, layout: adminLayout });
});

router.get("/logout", isAdmin, async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await service.getUserByUsername(username);
    if (existingUser)
      return res.status(400).render("partials/message-username-exists", {
        layout: forbiddenLayout,
      });

    const hashedPassword = await bcryptjs.hash(password, 10);
    await service.createUser({
      username,
      password: hashedPassword,
    });
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).render("partials/message-registering-error", {
      layout: forbiddenLayout,
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const newGame = await service.addOrEditGame(req.body);
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Error creating game: ", error);
    res.status(500).send("Error creating game");
  }
});

router.put("/edit/:id", async (req, res) => {
  const affectedRows = await service.addOrEditGame(req.body, req.params.id);
  if (affectedRows == 0)
    res.status(404).json("No record with given id: " + req.params.id);
  else res.send("Updated successfully");
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const affectedRows = await service.deleteGame(req.params.id);

    if (affectedRows == 0) {
      res.status(404).json("No record with the given ID: " + req.params.id);
    } else {
      res.status(200).send("Deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting game:", error);
    res.status(500).send("Error deleting game");
  }
});

module.exports = router;
