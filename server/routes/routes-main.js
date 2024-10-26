const express = require("express");
const router = express.Router();

const service = require("../services/service");

router.get("", async (req, res) => {
  const games = await service.getAllGames();
  res.render("index", { games });
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.query || "";
    const games = await service.searchGames(query);
    res.json(games);
  } catch (error) {
    console.error("Error searching games:", error);
    res.status(500).send("Error searching games");
  }
});

router.get("/search/all", async (req, res) => {
  const games = await service.getAllGames();
  res.send(games);
});

router.get("/search/:id", async (req, res) => {
  const game = await service.getGameById(req.params.id);
  if (game == undefined)
    res.status(404).json("No record with given id : " + req.params.id);
  else res.send(game);
});

router.get("/logout", async (req, res) => {
  res.redirect("/");
});

module.exports = router;
