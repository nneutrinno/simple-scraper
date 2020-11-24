import {
    DeviceType,
    Option,
    Process,
    ProcessingPipeline,
    Pipeline,
    SearchResult
} from "./lib/types"

import puppeteer from 'puppeteer'
import { devices } from "./lib/constants";

async function main(): Promise<void> {
    const options: Option = {
        device: {
            type: DeviceType.Blackberry,
        },
        searchs: [
            'dia de não sei',
            'foo',
            'bar',
            'xpto',
        ]
    }

    const processing: ProcessingPipeline = {
        options,
        process: {},
    }

    await Promise
        .resolve(processing)
        .then(addBrowser)
        .then(addSearchResults)
    .then(console.log)
    
    async function addBrowser(pipeline: ProcessingPipeline): Promise<ProcessingPipeline> {
        const browser: puppeteer.Browser = await puppeteer.launch({
            headless: false
        })
        
        return {
            ...pipeline,
            process: {
                browser,
            },
        }
    }
    async function addSearchResults(pipeline: ProcessingPipeline): Promise<ProcessingPipeline> {
        const page = await pipeline.process.browser.newPage()
        await page.emulate(devices[DeviceType.Blackberry])

        await page.goto(`https://www.google.com/search?q=${options.searchs[0].replace(' ', '=')}`, {
            waitUntil: 'networkidle0'
        })

        const result = await page.evaluate(() => [...document.querySelectorAll('div > div > div > div > table td > div > div > span')].map(item => Array(9).fill('parentElement').reduce((item, property) => item[property], item) ).map((block): Partial<SearchResult> => ({
                title: block.querySelector('h3 span').textContent,
                link: block.querySelector('div a').textContent,
                description: document.querySelector('span span').textContent,
                searched: document.querySelector('a').href,
            })).map(search => (search.contentLength = search.description.length + search.title.length, search as SearchResult)))

        return {
            ...pipeline,
            process: {
                result
            }
        }
        
    }
}



main()