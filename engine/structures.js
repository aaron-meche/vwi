
const structures = {
    "View": line => {
        html.push(`<div ${gatherAttributes()[0]} class="view ${line.includes(":") ? line.split(": ")[1] : ""}">`)
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
    "Import": line => {
        readTextFile(line.split(":")[1].trim() + ".js", content => {
            eval(content)
        })
    },
    "Text": line => {
        let classStr = ""
        if (line.split(":").length > 2) {
            classStr = line.split(":")[2].trim()
        }
        try {
            html.push(`<div ${gatherAttributes(true)}>${eval(line.split(": ")[1])}</div>`)
        }
        catch (error) {
            html.push(`<div ${gatherAttributes(true)}>${line.split(": ")[1]}</div>`)
        }
    },
}