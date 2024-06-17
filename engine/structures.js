
function openCloseStruct(structName) {
    html.push(`<div ${gatherAttributes(true)} ui="${structName?.trim()}">`)
    sendClose(codeLineIndex, "/div")
}

function openCloseSpan(line, name) {
    html.push(`<span ${gatherAttributes(true)} ui="${name?.trim()}">`)
    sendClose(codeLineIndex, "/span")
}

function openCloseEachStack(stackName, line) {
    let valWorldSplit = line.split(":")[1].trim().split(" ")
    let callVar = valWorldSplit[0]
    let nickVar = valWorldSplit[2]

    eachBlocks.push()
    html.push(`<div ${gatherAttributes(true)} ui="${stackName}" each call="${callVar}" nick="${nickVar}">`)
    sendClose(codeLineIndex, "/div")
}

function TextUIElement(line, name) {
    let text = line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
    try {
        html.push(`<div ui="${name}" ${gatherAttributes(true)}>${eval(text)}</div>`)
    }
    catch (error) { 
        html.push(`<div ui="${name}" ${gatherAttributes(true)}>${text}</div>`)
    }
}

function customTextUIElement(attr, val) {
    try {
        html.push(`<div ${attr} ${gatherAttributes(true)}>${val}</div>`)
    }
    catch (error) { 
        html.push(`<div ${attr} ${gatherAttributes(true)}>${val}</div>`)
    }
}

const structures = {
    "View": line => { openCloseStruct("view") },
    "Define Class": line => {
        css.push(`.${line.replace("$", "")?.trim()} { ${gatherAttributes()}`)
        sendClose(codeLineIndex, "/css")
    },
    "VStack": line => { openCloseStruct("v-stack")  },
        "VGrid": line => { openCloseStruct("v-grid") },
        "VSplitStack": line => { openCloseStruct("v-split-stack") },
        "VPushStack": line => { openCloseStruct("v-push-stack") },
        "VPullStack": line => { openCloseStruct("v-pull-stack") },
        "VSpreadStack": line => { openCloseStruct("v-spread-stack") },
        "VEachStack": line => { openCloseEachStack("v-each-stack", line) },
    "HStack": line => { openCloseStruct("h-stack") },
        "HSplitStack": line => { openCloseStruct("h-split-stack") },
        "HPushStack": line => { openCloseStruct("h-push-stack") },
        "HPullStack": line => { openCloseStruct("h-pull-stack") },
        "HSpreadStack": line => { openCloseStruct("h-spread-stack") },
        "HEachStack": line => { openCloseEachStack("h-each-stack", line) },
    "TextStack": line => { openCloseSpan(line, "text-stack") },
    "Import": line => {
        let val = line.split(":")[1].trim()
        try {
            jsImports.push("static/" + eval(val))
        }
        catch (error) {
            jsImports.push(val)
        }
    },
    "Image": line => {
        console.log(line)
        console.log(line.split(":"))
        try {
            html.push(`<img ${gatherAttributes(true)} src='${line.split(":")[1].trim()}'>`)
        }
        catch (error) { 
            html.push(`<div ui="empty-photo"</div>`)
        }
    },
    "Span": line => { openCloseSpan(line, "span") },
    "Wrapper": line => { openCloseStruct("block") },
    "Block": line => { openCloseStruct("block") },
    "Div": line => { openCloseStruct("block") },
    "Element": line => { openCloseStruct("block") },
    "Text": line => { TextUIElement(line, "text") },
    "Title": line => { TextUIElement(line, "title") },
    "Subtitle": line => { TextUIElement(line, "subtitle") },
    "CodeStack": line => { openCloseStruct("code-stack") },
    "Code": line => { TextUIElement(line, "code") },
    "Storage": line => {
        let text = line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
        customTextUIElement(`ui="storage" val=${text}`, "...")
    },
    "StorageDefault": line => {
        let text = line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
        let key, val
        try {
            key = eval(text.split("as")[0]?.trim())
            val = eval(text.split("as")[1]?.trim())
        }
        catch (error) {
            key = text.split("as")[0]?.trim()
            val = text.split("as")[1]?.trim()
        }
        safetyStore(key, val)
    },
}