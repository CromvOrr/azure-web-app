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
    res.status(404).json("No record with given id: " + req.params.id);
  else res.send(game);
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
