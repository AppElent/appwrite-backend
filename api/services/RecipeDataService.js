const jsonld = require("jsonld");
const cheerio = require("cheerio");
const fetch = require("node-fetch");

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

    // Use jsonld.expand to expand the JSON-LD data
    const expanded = await jsonld.expand(jsonData);

    // Filter the expanded data to find the recipe information
    const recipe = expanded.find(
      (item) => item["@type"] && item["@type"].includes("Recipe")
    );

    if (!recipe) {
      throw new Error("Recipe data not found in JSON-LD");
    }

    // Extract relevant recipe fields
    const recipeData = {
      name: recipe["http://schema.org/name"]?.[0]?.["@value"] || "",
      ingredients:
        recipe["http://schema.org/recipeIngredient"]?.map((i) => i["@value"]) ||
        [],
      instructions:
        recipe["http://schema.org/recipeInstructions"]?.map(
          (inst) => inst["@value"]
        ) || [],
      cookingTime: recipe["http://schema.org/cookTime"]?.[0]?.["@value"] || "",
      image: recipe["http://schema.org/image"]?.[0]?.["@id"] || "",
      raw: recipe,
    };

    console.log(recipeData);
    return recipeData;
  } catch (error) {
    console.error("Error fetching recipe data:", error);
  }
}

export default getRecipeData;
