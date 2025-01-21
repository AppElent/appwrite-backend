// import * as jsonld from "jsonld";
import getRecipeDataNew from "@dimfu/recipe-scraper";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

// Function to fetch and parse JSON-LD recipe data
async function getRecipeData(url) {
  try {
    // Fetch the page content
    const options = {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0",
        "Accept-Encoding": "gzip, deflate, br",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      },
    };
    const response = await fetch(url, options);
    const html = await response.text();

    console.log(html);

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    const data = await getRecipeDataNew(
      "https://www.ah.nl/allerhande/recepten/hoofdgerechten"
    );
    console.log(data);

    // Extract JSON-LD script content
    const jsonLdScriptRaw = $('script[type="application/ld+json"]');
    const jsonLdScript = jsonLdScriptRaw.html();

    if (!jsonLdScript) {
      throw new Error("No JSON-LD data found on the page");
    }

    // Parse JSON-LD data
    const jsonData = JSON.parse(jsonLdScript);
    let recipe;
    if (Array.isArray(jsonData)) {
      recipe = jsonData[0];
    } else {
      recipe = jsonData["@graph"]?.find((gr) => gr["@type"] === "Recipe");
    }
    // console.log(jsonData["@graph"]);
    // console.log("-----");
    // console.log(jsonData["@graph"].find((gr) => gr["@type"] === "Recipe"));

    // // Use jsonld.expand to expand the JSON-LD data
    // const expanded = await jsonld.expand(jsonData);

    // Filter the expanded data to find the recipe information

    console.log("JSON data", jsonData);
    console.log("Recipe", recipe);

    if (!recipe) {
      throw new Error("Recipe data not found in JSON-LD");
    }

    console.log(recipe);
    return recipe;
  } catch (error) {
    console.error("Error fetching recipe data:", error);
    throw error;
  }
}

//getRecipeData("https://www.allrecipes.com/recipe/269592/lemon-herb-chicken-and-asparagus-foil-packs/");
// getRecipeData(
//   "https://thespiceadventuress.com/2015/12/10/slow-cooked-lamb-curry/amp/"
// );

getRecipeData("https://www.ah.nl/allerhande/recepten/hoofdgerechten");

export default getRecipeData;
