import { EmulateOptions } from "puppeteer";
import { DeviceType } from "./types";

export const devices: { [key in DeviceType]: EmulateOptions } =  {
    [DeviceType.Blackberry]: {
        userAgent:
            'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
        viewport: {
            width: 600,
            height: 1024,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
}