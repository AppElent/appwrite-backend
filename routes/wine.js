import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

import VivinoService from "../services/VivinoService.js";

const searchVivino = async (req, res, log) => {
  try {
    const query = req.query.query;
    if (!query) throw new Error("No query provided");
    log("1", url);
    const vivinoService = new VivinoService();
    const recipeData = await vivinoService.searchWine(query);
    // log(recipeData);
    res.json(recipeData);
  } catch (e) {
    log(e);
    res.json({ error: e.message });
  }
};

const getWineData = async (req, res, log) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    log("1", url);
    const vivinoService = new VivinoService();
    const recipeData = await vivinoService.getWineData(url);
    // log(recipeData);
    res.json(recipeData);
  } catch (e) {
    log(e);
    res.json({ error: e.message });
  }
};

router.get("/vivino/search", searchVivino);
router.get("/vivino", getWineData);

export default router;
