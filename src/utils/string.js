export function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getDateTimeFromTimestamp(timestamp) {
    if (!timestamp) {
        return ''
    }
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds
    var date = new Date(timestamp);

    return date.getDay().toString().padStart(2,"0") + "-" + date.getMonth().toString().padStart(2,"0") + "-" + date.getFullYear().toString().padStart(4, "0") + " " + date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
}