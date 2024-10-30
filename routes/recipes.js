import AppExpress from "@itznotabug/appexpress";
const router = new AppExpress.Router();

import getRecipeData from "../services/RecipeDataService.js";

const getRecipeInfo = (req, res) => {
  try {
    const url = req.query.url;
    getRecipeData(url).then((recipeData) => {
      res.json(recipeData);
    });
  } catch (e) {
    console.log(e);
    res.json({ error: e });
  }
};

router.get("/", getRecipeInfo);

export default router;
