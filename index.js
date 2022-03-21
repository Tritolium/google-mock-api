const puppeteer = require('puppeteer')

var browser

getPage = async () => {
    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    })

    return await browser.newPage()
}

exit = () => {
    browser.close()
}

googleConsent = async (page) => {
    const consent_allow = "#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.AIC7ge > form > div > div > button"
    await page.waitForSelector(consent_allow)
    await page.click(consent_allow)
}

translate = async (string, lang_in = "auto", lang_out = "de") => {
    const page = await getPage()
    const url = "https://translate.google.com/?sl=" + lang_in + "&tl=" + lang_out + "&text=" + string + "&op=translate"
    await page.goto(url)
    googleConsent(page)

    await page.waitForSelector("span.VIiyi > span > span")
    out = await page.$eval("span.VIiyi > span > span", (element) => {
        console.log(element.innerHTML)
        return element.innerHTML
    })
    page.close()
    return out
}

maps = async () => {
    const page = await getPage()
    const url = "https://maps.google.com"
    await page.goto(url)
    googleConsent(page)
}

async function run() {
    console.log(await translate("well here we are again, it's always such a pleasure, remember when you tried to kill me twice", "en", "de"))
    exit()
}

run()