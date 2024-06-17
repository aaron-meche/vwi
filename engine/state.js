
function refreshState() {
    let script = document.createElement("script")
    script.textContent = js.join("\n")
    script.type = "text/javascript";
    document.head.appendChild(script)

    refreshEachBlocks()
    refreshStorageDisplays()
}

function refreshEachBlocks() {
    document.querySelectorAll('[each]').forEach(eachBlock => {
        let call = eachBlock.getAttribute("call")
        let nick = eachBlock.getAttribute("nick")
        let template = eachBlock.innerHTML
        let contents = []
        try {
            eval(call).forEach(item => {
                let newTemplate = template
                let callStack = []
                let callCount = newTemplate.split("{").length - 1
                for (let i = 0; i < callCount; i++) {
                    let index = newTemplate.indexOf("{")
                    let evalStr = ""
                    for (let i = index + 1; i < newTemplate.length; i++) {
                        if (template.split("")[i] !== "}") {
                            evalStr += template.split("")[i]
                        }
                        else {
                            newTemplate = newTemplate.replace("{", " ")
                            break
                        }
                    }
                    try {
                        callStack.push([evalStr + "}", eval(evalStr.replaceAll(nick, "item"))])
                    }
                    catch (error) {
                        callStack.push([evalStr + "}", "error"])
                    }
                }
                callStack.forEach(call => {
                    newTemplate = newTemplate.replace(call[0], call[1])
                })
                contents.push(newTemplate)
            })
        }
        catch (error) { console.error(error) }
        eachBlock.innerHTML = contents.join("\n")
    })
}

function refreshStorageDisplays() {
    document.querySelectorAll('[ui="storage"]').forEach(storageCall => {
        // console.log(storageCall.getAttribute("val"))
        storageCall.innerHTML = getStorage(storageCall.getAttribute("val"))
        console.log(storageCall.getAttribute("val"), getStorage(storageCall.getAttribute("val")))
    })
}