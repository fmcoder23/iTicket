
const month = ['January', 'February', 'March', 'April', 'May', 'Jun', 'July', "August", 'September', 'October', 'November', 'December']

const dateDM = (ISO) => {
    const date = new Date(ISO)
    return date.getDay() + ' ' + month[date.getMonth()]
}

const datHM = (ISO) => {
    const date = new Date(ISO)
    const h = date.getHours() + ''
    const m = date.getMinutes() + ''
    return h + ":" + (m.length == 1 ? "0" + m : m)
}

export {datHM,dateDM};