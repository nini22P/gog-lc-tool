import { render } from 'preact'
import { useState, useEffect } from 'preact/hooks'

const regionMap = {
    AR: { name: 'Argentina', currencies: ['USD'] },
    CN: { name: 'China', currencies: ['CNY', 'USD'] },
    JP: { name: 'Japan', currencies: ['USD'] },
    RU: { name: 'Russia', currencies: ['RUB', 'USD'] },
    TR: { name: 'Turkey', currencies: ['TRY', 'USD'] },
    UA: { name: 'Ukraine', currencies: ['USD'] },
    US: { name: 'United States', currencies: ['USD'] },
}

const regions = Object.keys(regionMap)

const checkSite = (setInvalid) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!/gog\.com/.test(tabs[0]?.url)) {
            setInvalid(true)
        }
    })
}

const restore = (setRegion, setCurrency, setLanguage) => {
    chrome.cookies.get({
        url: 'https://www.gog.com',
        name: 'gog_lc'
    }, (cookie) => {
        if (cookie) {
            const [r, c, l] = cookie.value.split('_')
            if (regionMap[r] && regionMap[r].currencies.includes(c)) {
                setRegion(r)
                setCurrency(c)
                setLanguage(l || 'en')
            }
        }
    })
}

const saveCookie = (region, currency, language) => {
    if (!region || !currency) return
    chrome.cookies.set({
        url: 'https://www.gog.com',
        name: 'gog_lc',
        value: `${region}_${currency}_${language || 'en'}`,
        domain: '.gog.com',
    })
}

const resetCookie = () => {
    chrome.cookies.remove({
        url: 'https://www.gog.com',
        name: 'gog_lc'
    })
}

const reloadPage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id)
    })
}

const App = () => {
    const [invalid, setInvalid] = useState(false)
    const [region, setRegion] = useState(null)
    const [currency, setCurrency] = useState(null)
    const [language, setLanguage] = useState(null)

    useEffect(() => {
        checkSite(setInvalid)
        restore(setRegion, setCurrency, setLanguage)
    }, [])

    const currencies = region ? regionMap[region].currencies : []

    const handleRegionChange = (e) => {
        const r = e.target.value
        setRegion(r)
        setCurrency(regionMap[r].currencies[0])
    }

    const handleSave = () => {
        saveCookie(region, currency, language)
        reloadPage()
    }

    const handleReset = () => {
        resetCookie()
        reloadPage()
    }

    if (invalid) {
        return <h2 class="max-content-width">Please open in <a href="https://www.gog.com" target="_blank">gog.com</a></h2>
    }

    return (
        <div>
            <div id="radio-wrapper">
                <fieldset class="radio-group">
                    <legend>Region</legend>
                    {regions.map(r => (
                        <label key={r} title={regionMap[r].name}>
                            <input type="radio" name="region" value={r} checked={region === r} onChange={handleRegionChange} /> {r}
                        </label>
                    ))}
                </fieldset>

                <fieldset class="radio-group">
                    <legend>Currency</legend>
                    {currencies.map(c => (
                        <label key={c}>
                            <input type="radio" name="currency" value={c} checked={currency === c} onChange={(e) => setCurrency(e.target.value)} /> {c}
                        </label>
                    ))}
                </fieldset>
            </div>

            <div id="button-group">
                <button class="btn" title="save and reload" onClick={handleSave}>⭕</button>
                <button class="btn" title="reset local" onClick={handleReset}>❌</button>
            </div>
        </div>
    )
}

render(<App />, document.getElementById('app'))
