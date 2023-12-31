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
  dom.window.document.querySelectorAll("a").forEach((value) => {
    let href = value.href;

    if (value.href.includes("about:blank")) {
      href = value.href.replace(/^about:blank/, "");      
    }

    const myUrl = new URL(href, baseURL);
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

      await Promise.all(urls.map(async (url) => {
        try {
          if (pages[url] === undefined) {
            pages[url] = new Set([currentUrl]);

            if (currentUrl.includes(normalizeURL(baseURL))) {
              await crawlPage(baseURL, url, pages);
            }
          } else {
            pages[url].add(currentUrl);
          }
        } catch (err) {
          console.error(err);
        }
      }));
      
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
