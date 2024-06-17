
let code = ""
let codeLineSplit = []
let codeLineIndex = 0
let empty = ""
let js = []
let jsImports = []
let html = []
let css = []
let view = []

window.addEventListener("load", () => {
    console.time("load")
    readTextFile("routes/Main.vwi", text => {
        code = text
        codeLineSplit = code.split("\n")
        for (let i = 0; codeLineIndex < codeLineSplit.length; codeLineIndex++) {
            translateLine(codeLineSplit[codeLineIndex], i)
        }

        jsImports.forEach(importPath => {
            readTextFile(importPath, val => {
                js.push(val)
                refreshState()
            })
        })

        document.body.innerHTML = html.join("\n")
        document.body.innerHTML += `<style>${css.join("\n")}<style>`
        console.timeEnd("load")
    })
})

function readTextFile(fileName, callback) {
    let loadedFile = fileName
    let rawFile = new XMLHttpRequest()
    rawFile.open("GET", "./" + fileName, true)
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) callback(rawFile.responseText)
    }
    rawFile.send()
}

function translateLine(line) {
    let lineSplit = line.trim().split(" ")
    let firstKey = lineSplit[0]?.trim()
    let secondKey = lineSplit[1]?.trim()
    let thirdKey = lineSplit[2]?.trim()

    // Declare Variable
    if (firstKey == "##" || firstKey == '""' || firstKey == "!!") {
        declareVariable(firstKey, secondKey.replace(":", ""), line.split(": ")[1])
    }
    // Call Structure
    else if (/^[A-Z]/.test(firstKey)) {
        callStructure(firstKey.replace(":", ""))
    }
    // Define Span
    else if (firstKey.includes('"') || firstKey.includes("'")) {
        callStructure("Span")
    }
    // Call Function
    else if (firstKey == "()") {
        runFunction(secondKey)
    }
    // Define Style Class
    else if (firstKey == "$") {
        defineClass(secondKey)
    }
    // Javascript Code
    else if (firstKey == ">|") {
        js.push(`${code},`)
    }
    // Close Div
    else if (firstKey == "/div") {
        html.push("</div>")
    }
    // Close Div
    else if (firstKey == "/span") {
        html.push("</span>")
    }
    // Close CSS
    else if (firstKey == "/css") {
        css.push("}")
    }
}

function declareVariable(type, name, val) {
    js.push(`let ${name} = ${val};`)
}

function callStructure(name) {
    let line = codeLineSplit[codeLineIndex]
    try {
        structures?.[name](line)
    }
    catch (error) {
        html.push(line)
        console.error(error)
    }
}

function runFunction(functionName) {
    js.push(`${functionName}(),`)
}

function defineClass(name) {
    let line = codeLineSplit[codeLineIndex]
    structures["Define Class"](line)
}

function gatherAttributes(rawReponse) {
    let attrStr = ""
    let styleVal = ""

    let callAlt = codeLineSplit[codeLineIndex]?.match(/^\s*/)[0].length
    let attrAlt = codeLineSplit[codeLineIndex + 1]?.match(/^\s*/)[0].length
    for (let i = codeLineIndex + 1; i < codeLineSplit.length; i++) {
        let currAlr = codeLineSplit[i]?.match(/^\s*/)[0].length
        let line = codeLineSplit[i].trim()
        let key = line.split(":")[0]?.trim()
        let value = line.split(":")[1]?.trim().replaceAll("[", "var(--").replaceAll("]", ")")
        if (codeLineSplit[i]?.replaceAll(" ", "").length == 0) continue
        if (codeLineSplit[i].trim().charAt(0) == "/") {
            continue
        }
        else if (codeLineSplit[i].trim().charAt(0) == "@") {
            attrStr += codeLineSplit[i].split(":")[0]?.trim().replace("@", "") + "="
            attrStr += '"' + codeLineSplit[i].split(":")[1]?.trim() + '"'
        }
        else if (currAlr < attrAlt || !(/^[a-z]/.test(codeLineSplit[i].trim().charAt(0)))) {
            i = codeLineSplit.length
        }
        else {
            key = translateAttribute(key)
            styleVal += `${key}:${value};`
        }
    }

    if (rawReponse) {
        return attrStr + 'style="' + styleVal + '"'
    }
    else {
        return styleVal
    }
}

function sendClose(start, code) {
    let startAlr = codeLineSplit[start].match(/^\s*/)[0].length
    let insertIndex = codeLineSplit.length
    for (let i = codeLineIndex + 1; i < codeLineSplit.length; i++) {
        let currAlr = codeLineSplit[i].match(/^\s*/)[0].length
        if (currAlr <= startAlr && codeLineSplit[i].replaceAll(" ", "").length > 0) {
            insertIndex = i
            i = codeLineSplit.length
        } 
    }
    codeLineSplit.splice(insertIndex, 0, code)
}