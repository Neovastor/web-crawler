const { argv } = require("node:process");
const { crawlPage } = require("./code/crawl");
const { printReport } = require("./code/report");

async function main() {
  const argArr = argv.slice(2);
  if (argArr.length === 1) {
    const baseURL = argArr[0];
    let pages = {};
    await crawlPage(baseURL, baseURL, pages);

    printReport(pages)
  } else {
    throw Error("Error: argument must be 1");
  }
}

main();