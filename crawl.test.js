const { test, expect } = require("@jest/globals");
const { normalizeURL, getURLsFromHTML } = require("./crawl");
const fs = require("fs");

const expectedResult = "blog.boot.dev/path";
const baseUrl = "https://www.example.com";

test("test 1", () => {
  expect(normalizeURL("https://blog.boot.dev/path/")).toBe("https://blog.boot.dev/path");
});

test("test 2", () => {
  expect(normalizeURL("https://blog.boot.dev/path")).toBe("https://blog.boot.dev/path");
});

test("test 3", () => {
  expect(normalizeURL("http://blog.boot.dev/path/")).toBe("http://blog.boot.dev/path");
});

test("test 4", () => {
  expect(normalizeURL("http://blog.boot.dev/path")).toBe("http://blog.boot.dev/path");
});

/*
1. Read html file as string
2. Test that relative URLs are converted to absolute URLs.
3. Test to be sure you find all the <a> tags in a body of HTML
*/
test("test 5", () => {
  const html = fs.readFileSync("test.html", {
    encoding: "utf-8",
  });
  const result = getURLsFromHTML(html, baseUrl);
  expect(result.length).toBe(5);
  console.log(result);
  result.forEach((value) => {
    expect(value).toBeDefined();
  });
});

test('getURLsFromHTML both', () => {
  const inputURL = 'https://blog.boot.dev'
  const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
  const actual = getURLsFromHTML(inputBody, inputURL)
  const expected = [ 'https://blog.boot.dev/path/one', 'https://other.com/path/one' ]
  expect(actual).toEqual(expected)
})

