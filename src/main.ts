import {
    DeviceType,
    Option,
    Process,
    ProcessingPipeline,
    Pipeline,
    SearchResult,
    CreateSearchProcessing
} from "./lib/types"

import puppeteer from 'puppeteer'
import { devices } from "./lib/constants";

async function main(): Promise<void> {
    const options: Option = {
        device: {
            type: DeviceType.Blackberry,
        },
        searchs: [
            'dia da consciência negra',
            'dia de não sei',
            'foo',
            'bar',
            'xpto',
        ].map(search => search.replace(' ', '='))
    }

    const processing: ProcessingPipeline = {
        options,
        process: {},
    }

    let id = 0;

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

        const result = await Promise.all([
            Promise.resolve({pipeline, to: options.searchs[id++]}).then(createSearchAndGetResult),
            Promise.resolve({pipeline, to: options.searchs[id++]}).then(createSearchAndGetResult)
        ]).then(console.log)

        return {
            ...pipeline,
        }
        
    }

    async function createSearchAndGetResult(processing: CreateSearchProcessing): Promise<Partial<SearchResult[]>>{
        const page = await processing.pipeline.process.browser.newPage()
        await page.emulate(devices[DeviceType.Blackberry])

        await page.goto(`https://www.google.com/search?q=${processing.to}`, {
            waitUntil: 'networkidle0'
        })

        const result = await page.evaluate(() => 
        [...document.querySelectorAll('div > div > div > div > table td > div > div > span')]
        .map(item => Array(9).fill('parentElement').reduce((item, property) => item[property], item) )
        .map((block): Partial<SearchResult> => ({
            title: document.querySelector('div > div > a > span').textContent,
            link: document.querySelector('div > div > a').attributes.getNamedItem('href').value,
            description: document.querySelector('table > tr > td > div > div > span > span').textContent,
            searched: document.querySelector('a').href,
        }))
        .map(search => 
            (search.contentLength = search.description.length + search.title.length, search as SearchResult))
        )

        return result
    }
}



main()