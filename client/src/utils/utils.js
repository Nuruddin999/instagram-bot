export function delayInRequest(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}