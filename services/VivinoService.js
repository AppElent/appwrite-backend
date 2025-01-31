import * as cheerio from "cheerio";

export default class VivinoService {
  constructor() {}

  async getData(url) {
    try {
      // Fetch the HTML content of the URL
      const html = await (await fetch(url)).text();

      // Get the processed HTML from Cheerio
      // Load the HTML into cheerio
      const $ = cheerio.load(html);

      // Extract JSON-LD script content
      const jsonLdScriptRaw = $('script[type="application/ld+json"]');
      const jsonLdScript = jsonLdScriptRaw.html();

      if (!jsonLdScript) {
        throw new Error("No JSON-LD data found on the page");
      }

      // Parse JSON-LD data
      const jsonData = JSON.parse(jsonLdScript);
      //   let wine;
      //   if (Array.isArray(jsonData)) {
      //     wine = jsonData[0];
      //   } else {
      //     wine = jsonData["@graph"]?.find((gr) => gr["@type"] === "Wine");
      //   }

      //   if (!wine) {
      //     throw new Error("Wine data not found in JSON-LD");
      //   }

      return jsonData;
    } catch (error) {
      console.error("Error fetching wine data:", error);
      throw error;
    }
  }

  async searchWine(query) {
    try {
      const url = `https://www.vivino.com/search/wines?q=${query}`;
      return await this.getData(url);
    } catch (error) {
      console.error("Error searching for wine:", error);
      throw error;
    }
  }

  async getWineData(url) {
    try {
      return await this.getData(url);
    } catch (error) {
      console.error("Error fetching wine data:", error);
      throw error;
    }
  }
}

// const url = "https://www.vivino.com/NL/nl/bodega-norton-roble-malbec/w/3317";
// const service = new VivinoService();
// const data = await service.getWineData(url);
// console.log(data);
//console.log(await service.searchWine("norton malbec"));
