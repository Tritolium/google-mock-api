const puppeteer = require('puppeteer')


/**
 * @type puppeteer.Browser
 */
var browser = undefined

/**
 * @type puppeteer.Page
 */
var page_translate = undefined

startService = async () => {
    browser = await puppeteer.launch({
        headless: true,
        defaultViewport: null
    })
    console.log('Service running')
}

stopService = async () => {
    if (browser != undefined) {
        browser.close()
        browser = undefined
        console.log('Service stopped')
    } else {
        console.log('Service not running, no need for stopping it')
    }
}

googleConsent = async (page) => {
    const consent_allow = "#yDmH0d > c-wiz > div > div > div > div.NIoIEf > div.G4njw > div.AIC7ge > form > div > div > button"
    await page.waitForSelector(consent_allow)
    await page.click(consent_allow)
}

/**
 * @returns the translated text
 */
translate = async (text, lang_out, lang_in) => {
    if (browser == undefined){
        console.log('Service not running')
        return
    }

    if (page_translate == undefined) {
        page_translate = await browser.newPage()
        await page_translate.goto('https://translate.google.com')
        googleConsent(page_translate)
    }

    const url = "https://translate.google.com/?sl=" + lang_in + "&tl=" + lang_out + "&text=" + text + "&op=translate"
    await page_translate.goto(url)
    await page_translate.waitForSelector("span.VIiyi > span > span")
    out = await page_translate.$eval("span.VIiyi > span > span", (element) => {
        console.log(element.innerHTML)
        return element.innerHTML
    })
    console.log(out)
    return out
}

module.exports = { startService, stopService, translate }