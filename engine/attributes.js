
const attributeDictionary = {
    "align": "text-align",
    "size": "font-size",
    "weight": "font-weight",
    "spacing": "letter-spacing",
}

function translateAttribute(key) {
    if (Object.keys(attributeDictionary).includes(key)) {
        return attributeDictionary[key]
    }
    else {
        return key
    }
}