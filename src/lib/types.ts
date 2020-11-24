import puppeteer from 'puppeteer'

export interface SearchResult {
    searched: string
    title: string
    description: string
    link: string
    contentLength: number
}


export enum DeviceType {
    Blackberry = 'blackberry',
}

export interface Option {
    device: {
        type: DeviceType
    }
    searchs: string[]
}
export interface Process {
    browser: puppeteer.Browser
    result: SearchResult[]
}

export interface ProcessingPipeline {
    options: Option
    process: Partial<Process>
}

export type Pipeline = Compute<DeepRequired<ProcessingPipeline>>
export type Compute<T> = { [key in keyof T]: T[key] } & {}
export type DeepRequired<Source> = { [key in keyof Source]: Source[key] extends object ? Required<Source[key]> : Source[key] }

