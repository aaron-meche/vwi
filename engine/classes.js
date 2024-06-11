
function Icon(name, attr) {
    return `<i ${attr} class="fa-solid fa-${name}"></i>`
}

function Light(percent) {
    let portion255 = Math.floor(((percent / 100) * 255))
    return `rgb(${portion255}, ${portion255}, ${portion255})`
}