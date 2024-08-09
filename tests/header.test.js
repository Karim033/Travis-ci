const puppeteer = require("puppeteer");
const sessionFactory = require("./factory/sessionFactory.js");
const userFactory = require("./factory/userFactory.js");
let page, browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("The header has the correct text", async () => {
  const text = await page.$eval("a.brand-logo", (el) => el.innerHTML);
  expect(text).toEqual("Blogster");
});

test("Clicking on the link takes you to Oauth page", async () => {
  await page.click(".right a");
  const url = await page.url();
  expect(url).toMatch(/accounts\.google\.com/);
});

test("when we signed in , shows logout button", async () => {
  const user = await userFactory();
  const { session, sig } = sessionFactory(user);
  await page.setCookie({
    name: "session",
    value: session,
  });
  await page.setCookie({
    name: "session.sig",
    value: sig,
  });
  await page.goto("http://localhost:3000");
  await page.waitForSelector("a[href='/api/logout']");
  const text = await page.$eval("a[href='/api/logout']", (el) => el.innerHTML);

  expect(text).toEqual("Logout");
});
