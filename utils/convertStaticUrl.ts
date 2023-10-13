/**
 * 
 * @param url with or without https protocol
 * @returns url with https protocol
 */
export default function convertStaticUrl(url: string): string {
    if(!url) return url;
    return url.startsWith('//') ? `https:${url}` : url;
}