const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const nodeFetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

function normalizeURL(url) {
  const myUrl = new URL(url);
  let result = myUrl.origin + myUrl.pathname;
  if (result[result.length - 1] === "/") {
    return result.substring(0, result.length - 1);
  }

  return result;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  
  let result = [];
  dom.window.document.querySelectorAll("a").forEach((value, key, parent) => {
    const myUrl = new URL(value.href, baseURL);
    result.push(myUrl.href);
  });
  return result;
}

async function crawlPage(baseURL, currentUrl, pages) {
  const value = await nodeFetch(currentUrl);

  try {
    if (value.status >= 400) {
      // throw Error(`Error with status ${value.status}, ${value.statusText}`);
      console.log(`Error with status ${value.status}, ${value.statusText}`);
    } else if (!value.headers.get("content-type").includes("text/html")) {
      // throw Error(`Error content-type not text/html`);
      console.log(`Error content-type not text/html`);
    } else {
      let text = await value.text();
      let urls = getURLsFromHTML(text, currentUrl);
      console.log("this is current Url = ", currentUrl);
      // console.log(pages);
      for (let index = 0; index < urls.length; index++) {
        const url = urls[index];
        // console.log(`I will be crawling ${url} with index ${index} and from url ${currentUrl}`)
        
        if (pages[url] === undefined) {
          pages[url] = new Set([currentUrl]);

          if (currentUrl.includes(normalizeURL(baseURL))) {
            await crawlPage(baseURL, url, pages);
          }
        } else {
          pages[url].add(currentUrl);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }
}

function updatePages(urls, pages) {
  urls.forEach((value) => {
    if (pages[value] === undefined) {
      pages[value] = 1;
    } else {
      pages[value]++;
    }
  });
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
