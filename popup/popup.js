const regionInput = document.getElementById('region-select')
const languageInput = document.getElementById('language-select')
const saveButton = document.getElementById('save')
const resetButton = document.getElementById('reset')

const reset = () => {
    chrome.cookies.remove({
        url: 'https://www.gog.com',
        name: 'gog_lc'
    });
}

const save = () => {
    const region = regionInput.value
    const language = languageInput.value

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
    chrome.cookies.get({ url: 'https://www.gog.com', name: 'gog_lc' }, (cookie) => {
        if (cookie) {
            const [region, currency, language] = cookie.value.split('_')
            regionInput.value = `${region}_${currency}`
            languageInput.value = language
        }
    });
}

const reloadPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id)
    });
}

saveButton.addEventListener('click', () => {
    save()
    reloadPage()
})

resetButton.addEventListener('click', () => {
    reset()
    reloadPage()
})

document.addEventListener('DOMContentLoaded', restore)