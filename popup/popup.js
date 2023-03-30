const regionSelect = document.getElementById('region-select')
const saveButton = document.getElementById('save')
const resetButton = document.getElementById('reset')
let currentLanguage = null

const reset = () => {
    chrome.cookies.remove({
        url: 'https://www.gog.com',
        name: 'gog_lc'
    })
}

const save = () => {
    const region = regionSelect.value
    const language = currentLanguage

    chrome.cookies.set({
        url: 'https://www.gog.com',
        name: 'gog_lc',
        value: `${region}_${language}`,
        domain: '.gog.com',
    }, () => {
        console.log('Cookie set')
    })
}

const restore = () => {
    chrome.cookies.get({
        url: 'https://www.gog.com',
        name: 'gog_lc'
    }, (cookie) => {
        if (cookie) {
            const [region, currency, language] = cookie.value.split('_')
            regionSelect.value = `${region}_${currency}`
            currentLanguage = language
        }
    })
}

const reloadPage = () => {

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        chrome.tabs.reload(tabs[0].id)
    })
}

const checkSite = () => {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, (tabs) => {
        if (!/gog\.com/.test(tabs[0].url)) {
            document.querySelector('body')
                .innerHTML = '<h2 class="max-content-width">Please open in <a href="https://www.gog.com" target="_blank">gog.com</a></h2>'
        }
    })
}

saveButton.addEventListener('click', () => {
    save()
    reloadPage()
})

resetButton.addEventListener('click', () => {
    reset()
    reloadPage()
})

document.addEventListener('DOMContentLoaded', () => {
    checkSite()
    restore()
})