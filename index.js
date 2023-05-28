const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

async function crawlWebsite(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Extract all links
    const links = [];
    $("a").each((index, element) => {
      const href = $(element).attr("href");
      if (href) {
        // add links that have the word 'products' in them
        if (href.includes("products") && !href.includes("sso")) {
          links.push(href);
          // if duplicate links, don't write to csv file
          if (links.indexOf(href) !== links.lastIndexOf(href)) {
            return;
          }
          // write to csv file
          fs.appendFile(
            "links.csv",
            "https://newrelic.com/" + href + "\n",
            function (err) {
              if (err) throw err;
            }
          );
        }
      }
    });

    // Print the links
    console.log(links);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Specify the URL of the website you want to crawl
const websiteUrl = process.env.URL || "https://newrelic.com/";

// Start crawling the website
crawlWebsite(websiteUrl);
