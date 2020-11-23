import { Result, DeviceType } from "./lib/types"
import puppeteer from 'puppeteer'


interface SearchAndResult {
    search: string
    result: Result
}


interface Option {
    device: {
        type: DeviceType
    }
    searchs: string[]
}
interface Process {
    browser: puppeteer.Browser
    result: Result[]
}

interface Pipeline {
    options: Option
    process: Process
}

async function main(): Promise<void> {
    const options: Option = {
        
    }
    const searchs: string[] = [
        'dia de não sei',
        'foo',
        'bar',
        'xpto',
    ]

    await Promise
        .resolve(searchs)
        .then(addBrowser)
        .then(addSearchResults)
    .then(console.log)
    
    async function addBrowser(searchs: string[]): Promise<Partial<Pipeline>> {
        const browser: puppeteer.Browser = await puppeteer.launch({
            headless: false
        })

        const page = browser.newPage()
        ;(await page).emulate(devices[DeviceType.Blackberry])
        return {
            browser,
            searchs,
        }
    }
    async function addSearchResults(pipeline: Pipeline) {
        return {
            ...pipeline,
            // result: pipeline.searchs.map(search)
        }
        // async function search(text: string): Promise<Result[]> {
        //     const page = 
        //     return
        // }
    }
}



main()