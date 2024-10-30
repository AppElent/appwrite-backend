import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

import getRecipeData from "../services/RecipeDataService.js";

const getRecipeInfo = async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) throw new Error("No URL provided");
    const recipeData = await getRecipeData(url);
    console.log(recipeData);
    res.json(recipeData);
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
};

router.get("/", getRecipeInfo);

export default router;
