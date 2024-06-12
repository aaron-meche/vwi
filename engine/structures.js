
const structures = {
    "View": line => {
        html.push(`<div ${gatherAttributes(true)} ui="view">`)
        sendClose(codeLineIndex, "/div")
    },
    "Define Class": line => {
        css.push(`.${line.trim().replaceAll(" ", "").replace("$", "")} { ${gatherAttributes()}`)
        sendClose(codeLineIndex, "/css")
    },
    "VStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="v-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "VGrid": line => {
        html.push(`<div ${gatherAttributes(true)} ui="v-grid">`)
        sendClose(codeLineIndex, "/div")
    },
    "VSplitStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="v-split-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "VSpreadStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="v-spread-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "HStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="h-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "HSplitStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="h-split-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "HSpreadStack": line => {
        html.push(`<div ${gatherAttributes(true)} ui="h-spread-stack">`)
        sendClose(codeLineIndex, "/div")
    },
    "Each": line => {
        let valWorldSplit = line.split(":")[1].trim().split(" ")
        let callVar = valWorldSplit[0]
        let nickVar = valWorldSplit[2]

        eachBlocks.push()
        html.push(`<span ${gatherAttributes(true)} ui="each" call="${callVar}" nick="${nickVar}">`)
        sendClose(codeLineIndex, "/span")
    },
    "Import": line => {
        jsImports.push("static/" + line.split(":")[1].trim())
    },
    "Text": line => {
        let classStr = ""
        if (line.split(":").length > 2) {
            classStr = line.split(":")[2].trim()
        }
        try {
            html.push(`<div ${gatherAttributes(true)}>${eval(line.split(":")[1].trim())}</div>`)
        }
        catch (error) {
            html.push(`<div ${gatherAttributes(true)}>${line.split(": ")[1]}</div>`)
        }
    },
}