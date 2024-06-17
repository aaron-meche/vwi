
const attributeDictionary = {
    "align": "text-align",
    "size": "font-size",
    "weight": "font-weight",
    "spacing": "letter-spacing",
    "grid-row": "grid-template-rows",
    "grid-column": "grid-template-columns",
}

function translateAttribute(key) {
    if (Object.keys(attributeDictionary).includes(key)) {
        return attributeDictionary[key]
    }
    else {
        return key
    }
}