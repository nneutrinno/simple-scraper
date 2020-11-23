import {
    DeviceType,
    Option,
    Process,
    ProcessingPipeline,
    Pipeline,
} from "./lib/types"
import puppeteer, { devices } from 'puppeteer'

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

        return {
            ...pipeline,
        }
        
    }
}



main()