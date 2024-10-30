import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

import getRecipeData from "../services/RecipeDataService.js";

const getRecipeInfo = async (req, res, log) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    const recipeData = await getRecipeData(url);
    log(recipeData);
    log(req.host);
    let corsHeader = "https://appelent.site";
    if (host === "localhost") {
      corsHeader = "http://localhost";
    }
    res.json(recipeData, 200, {
      "Access-Control-Allow-Origin": corsHeader, // Required for CORS support to work
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
};

router.get("/", getRecipeInfo);

export default router;
