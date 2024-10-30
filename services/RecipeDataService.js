// import * as jsonld from "jsonld";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

// Function to fetch and parse JSON-LD recipe data
async function getRecipeData(url) {
  try {
    // Fetch the page content
    const response = await fetch(url);
    const html = await response.text();

    // Load the HTML into cheerio
    const $ = cheerio.load(html);

    // Extract JSON-LD script content
    const jsonLdScript = $('script[type="application/ld+json"]').html();

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

getRecipeData(
  "https://ashishbhatia3.wordpress.com/2015/01/21/dhabe-ka-gosht-highway-lamb-curry/amp/"
);

export default getRecipeData;
