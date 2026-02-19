import { isProd } from "./isProd";

export function getTestingUrl(path: string = '', queryParams: Record<string, string> = {}) {
    const testingUrl = process.env.TESTING_URL;

    const baseUrl: string = testingUrl ? testingUrl : isProd() 
        ? process.env.PRODUCTION_URL as string 
        : process.env.STAGING_URL as string;

    const url = new URL(path, baseUrl);
    Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.set(key, value);
    });
    return url.toString();
}