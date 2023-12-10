const fs = require('node:fs');


function printReport(pages) {
  const orderedPages = Object.keys(pages)
    .sort()
    .reduce((obj, key) => {
      obj[key] = Array.from(pages[key]);
      return obj;
    }, {});

  fs.writeFileSync(
    "./data.json",
    JSON.stringify(orderedPages, null, 2),
    "utf-8"
  );
}

module.exports = {
  printReport,
};
