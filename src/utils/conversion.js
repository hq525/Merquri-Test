export function kelvinToCelsius(temp) {
    if (temp !== 0 && !temp) {
        return ''
    }
    return Math.round(temp - 273.15)
}