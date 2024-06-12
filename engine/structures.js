
function openCloseStruct(structName) {
    html.push(`<div ${gatherAttributes(true)} ui="${structName?.trim()}">`)
    sendClose(codeLineIndex, "/div")
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
    let text = line.substring(line.indexOf(":") + 1)
    try {
        html.push(`<div ui="${name}" ${gatherAttributes(true)}>${eval(text)}</div>`)
    }
    catch (error) { 
        html.push(`<div ui="${name}" ${gatherAttributes(true)}>${text}</div>`)
    }
}

const structures = {
    "View": line => {
        openCloseStruct("view")
    },
    "Define Class": line => {
        css.push(`.${line.replace("$", "")?.trim()} { ${gatherAttributes()}`)
        sendClose(codeLineIndex, "/css")
    },
    "VStack": line => {
        openCloseStruct("v-stack")
    },
    "VGrid": line => {
        openCloseStruct("v-grid")
    },
    "VSplitStack": line => {
        openCloseStruct("v-split-stack")
    },
    "VSpreadStack": line => {
        openCloseStruct("v-spread-stack")
    },
    "VEachStack": line => {
        openCloseEachStack("v-each-stack", line)
    },
    "HStack": line => {
        openCloseStruct("h-stack")
    },
    "HSplitStack": line => {
        openCloseStruct("h-split-stack")
    },
    "HSpreadStack": line => {
        openCloseStruct("h-spread-stack")
    },
    "HEachStack": line => {
        openCloseEachStack("h-each-stack", line)
    },
    "Import": line => {
        jsImports.push("static/" + line.split(":")[1].trim())
    },
    "Image": line => {
        let src = line.substring(line.indexOf(":") + 1)?.trim()
        try {
            html.push(`<img ${gatherAttributes(true)} src="./static/${src}">`)
        }
        catch (error) { 
            html.push(`<div ui="empty-photo"</div>`)
        }
    },
    "Text": line => {
        TextUIElement(line, "text")
    },
    "Title": line => {
        TextUIElement(line, "title")
    },
    "Subtitle": line => {
        TextUIElement(line, "subtitle")
    },
    "CodeStack": line => {
        openCloseStruct("code-stack")
    },
    "Code": line => {
        TextUIElement(line, "code")
    },
}