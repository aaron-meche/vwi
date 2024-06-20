

class View {
    filePath = ""
    raw = ""
    rawLineSplit = []
    rawLineIndex = 0
    jsImports = []
    js = []
    html = []
    css = []

    constructor(fileName, callback) {
        this.filePath = "./routes/" + fileName

        readTextFile(this.filePath, res => {
            this.raw = res
            this.rawLineSplit = this.raw.split("\n")

            this.rawLineSplit.forEach(line => {
                this.processLine(line)

                this.rawLineIndex++
            })

            if (callback) {
                callback(this.html.join("\n") + "<style>" + this.css.join("\n") + "</style>")
            }

            this.jsImports.forEach(importPath => {
                readTextFile(importPath, val => {
                    this.js.push(val)
                    state.refreshState(this.js)
                })
            })

            state.refreshState(this.js)
        })
    }

    processLine(line) {
        let lineSplit = line.toString().trim().split(" ")
        let firstKey = lineSplit[0]?.trim()
        let secondKey = lineSplit[1]?.trim()
        let thirdKey = lineSplit[2]?.trim()

        // Declare Variable
        if (firstKey == "##" || firstKey == '""' || firstKey == "!!") {
            this.declareVariable(firstKey, secondKey.replace(":", ""), line.split(": ")[1])
        }
        // Call Structure
        else if (/^[A-Z]/.test(firstKey)) {
            this.callStructure(firstKey.replace(":", ""))
        }
        // Declare Structure
        // else if (/^[A-Z]/.test(firstKey)) {
        //     this.callStructure(firstKey.replace(":", ""))
        // }
        // Call Function
        else if (firstKey == "()") {
            this.runFunction(secondKey)
        }
        // Define Style Class
        else if (firstKey == "$") {
            this.defineClass(this.rawLineSplit[this.rawLineIndex])
        }
        // Javascript Code
        else if (firstKey == ">|") {
            this.js.push(`${code},`)
        }
        // Close Div
        else if (firstKey == "/div") {
            this.html.push("</div>")
        }
        // Close Div
        else if (firstKey == "/span") {
            this.html.push("</span>")
        }
        // Close CSS
        else if (firstKey == "/css") {
            this.css.push("}")
        }
        // Span
        else if (firstKey.includes('"') || firstKey.includes("'")) {
            this.callStructure("Span")
        }
    }

    declareVariable(type, name, val) {
        this.js.push(`let ${name} = ${val};`)
    }

    defineClass(line) {
        this.structures["Define Class"](line)
    }

    callStructure(structName) {
        let line = this.rawLineSplit[this.rawLineIndex]
        try {
            this.structures?.[structName](line)
        }
        catch (error) {
            console.error(error)
            this.html.push(line)
        }
    }

    callFunction(functionName) {
        this.js.push(`${functionName}(),`)
    }

    gatherAttributes(rawReponse) {
        let attrStr = ""
        let styleVal = ""
    
        let callAlt = this.rawLineSplit[this.rawLineIndex]?.match(/^\s*/)[0].length
        let attrAlt = this.rawLineSplit[this.rawLineIndex + 1]?.match(/^\s*/)[0].length
        for (let i = this.rawLineIndex + 1; i < this.rawLineSplit.length; i++) {
            let currAlr = this.rawLineSplit[i]?.match(/^\s*/)[0].length
            let line = this.rawLineSplit[i].trim()
            let key = line.split(":")[0]?.trim()
            let value = line.split(":")[1]?.trim().replaceAll("[", "var(--").replaceAll("]", ")")
            if (this.rawLineSplit[i]?.replaceAll(" ", "").length == 0) continue
            if (this.rawLineSplit[i].trim().charAt(0) == "/") {
                continue
            }
            else if (this.rawLineSplit[i].trim().charAt(0) == "@") {
                attrStr +=  this.rawLineSplit[i].split(":")[0]?.trim().replace("@", "") + "="
                attrStr += "'" + this.rawLineSplit[i].split(":")[1]?.trim() + "'"
            }
            else if (currAlr < attrAlt || !(/^[a-z]/.test(this.rawLineSplit[i].trim().charAt(0)))) {
                i = this.rawLineSplit.length
            }
            else {
                key = attributes.translate(key)
                styleVal += `${key}:${value};`
            }
        }
    
        if (rawReponse) {
            return attrStr + `style="${styleVal}"`
        }
        else {
            return styleVal
        }
    }
    
    sendClose(code) {
        let startAlr = this.rawLineSplit[this.rawLineIndex].match(/^\s*/)[0].length
        let insertIndex = this.rawLineSplit.length
        for (let i = this.rawLineIndex + 1; i < this.rawLineSplit.length; i++) {
            let currAlr = this.rawLineSplit[i].match(/^\s*/)[0].length
            if (currAlr <= startAlr && this.rawLineSplit[i].replaceAll(" ", "").length > 0) {
                insertIndex = i
                break
            } 
        }
        this.rawLineSplit.splice(insertIndex, 0, code)
    }

    structures = {
        build: {
            struct: (structName, custom)  => {
                this.html.push(`<div ${this.gatherAttributes(true)} ${custom ? custom : ""} ui="${structName?.trim()}">`)
                this.sendClose("/div")
            },
            menu: (line, menuName)  => {
                this.html.push(`<div ${this.gatherAttributes(true)} menu="${menuName?.trim()}" ui="menu">`)
                this.sendClose("/div")
                this.structures.build.text(line, "menu-close", "Close")
            },
            span: (line, name)  => {
                this.html.push(`<span ${this.gatherAttributes(true)} ui="${name?.trim()}">`)
                this.sendClose("/span")
            },
            eachStack: (stackName, line)  => {
                let valWorlSplit = line.split(":")[1].trim().split(" ")
                let callVar = valWorlSplit[0]
                let nickVar = valWorlSplit[2]
                
                this.html.push(`<div ${this.gatherAttributes(true)} ui="${stackName}" each call="${callVar}" nick="${nickVar}">`)
                this.sendClose("/div")
            },
            text: (line, name, text, attr)  => {
                text = text ? text : line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
                try {
                    this.html.push(`<div ui="${name}" ${attr ? attr : this.gatherAttributes(true)}>${eval(text)}</div>`)
                }
                catch (error) { 
                    this.html.push(`<div ui="${name}" ${attr ? attr : this.gatherAttributes(true)}>${text}</div>`)
                }
            },
        },
        // General Stacks
        "VStack": line => { this.structures.build.struct("v-stack") },
        "HStack": line => { this.structures.build.struct("h-stack") },
        // Push Stacks
        "VPushStack": line => { this.structures.build.struct("v-push-stack") },
        "HPushStack": line => { this.structures.build.struct("h-push-stack") },
        // Pull Stacks
        "VPullStack": line => { this.structures.build.struct("v-pull-stack") },
        "HPullStack": line => { this.structures.build.struct("h-pull-stack") },
        // Each Stacks
        "GridEachStack": line => { this.structures.build.eachStack("grid", line) },
        "VEachStack": line => { this.structures.build.eachStack("v-stack", line) },
        "HEachStack": line => { this.structures.build.eachStack("h-stack", line) },
        // Other Views
        "View": line => { this.structures.build.struct("view") },
        "Grid": line => { this.structures.build.struct("grid") },
        // Imports
        "ImportJS": line => {
            let val = line.split(":")[1].trim()
            try {
                this.jsImports.push("static/" + eval(val) + ".js")
            }
            catch (error) {
                this.jsImports.push(val)
            }
        },
        // General HTML Elements
        "Image": line => {
            try {
                this.html.push(`<img ${this.gatherAttributes(true)} src='./static/${line.split(":")[1].trim()}'>`)
            }
            catch (error) { 
                this.html.push(`<div ui="empty-photo"</div>`)
            }
        },
        // Blocks
        "Block": line => { this.structures.build.struct("block") },
        "Wrapper": line => { this.structures.build.struct("block") },
        "Div": line => { this.structures.build.struct("block") },
        "Element": line => { this.structures.build.struct("block") },
        // Text
        "Text": line => { this.structures.build.text(line, "text") },
        "TextStack": line => { this.structures.build.span(line, "text-stack") },
        "Span": line => { this.structures.build.span(line, "span") },
        // Text Styles
        "Title": line => { this.structures.build.text(line, "title") },
        "Subtitle": line => { this.structures.build.text(line, "subtitle") },
        // Code Displays
        "Code": line => { this.structures.build.text(line, "code") },
        "CodeStack": line => { this.structures.build.struct("code-stack") },
        // State Storage
        "Storage": line => {
            let text = line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
            this.structures.build.text(`ui="storage" val=${text}`, "...")
        },
        "StorageDefault": line => {
            let text = line.substring(line.indexOf(":") + 1)?.split("*")[0]?.trim()
            let key, val
            try {
                key = eval(text?.split("as")[0]?.trim())
                val = eval(text?.split("as")[1]?.trim())
            }
            catch (error) {
                key = text?.split("as")[0]?.trim()
                val = text?.split("as")[1]?.trim()
            }
            this.safetyStore(key, val)
        },
        // CSS Classes
        "Define Class": line => {
            this.css.push(`.${line?.replace("$", "")?.trim()} { ${this.gatherAttributes()}`)
            this.sendClose("/css")
        },
    }

}

function readTextFile(fileName, callback) {
    let loadedFile = fileName
    let rawFile = new XMLHttpRequest()
    rawFile.open("GET", "./" + fileName, true)
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) callback(rawFile.responseText)
    }
    rawFile.send()
}

const classes = {
    Icon: (name, attr) => {
        return `<i ${attr} class="fa-solid fa-${name}"></i>`
    },
}

const attributes = {
    dictionary: {
        "align": "text-align",
        "size": "font-size",
        "weight": "font-weight",
        "spacing": "letter-spacing",
        "grid-row": "grid-template-rows",
        "grid-column": "grid-template-columns",
        "ratio": "aspect-ratio",
    },
    translate: (key) => {
        if (Object.keys(attributes.dictionary).includes(key)) {
            return attributes.dictionary[key]
        }
        else {
            return key
        }
    }
}

const state = {
    refreshState: (js) => {
        let script = document.createElement("script")
        script.textContent = js.join("\n")
        script.type = "text/javascript";
        document.head.appendChild(script)
        console.log(document.head)
    
        try {
            state.refreshEachBlocks()
            state.refreshStorageDisplays()
        }
        catch (error) {
            console.error(js, error)
        }
    },
    refreshEachBlocks: () => {
        document.querySelectorAll('[each]').forEach(eachBlock => {
            let call = eachBlock.getAttribute("call")?.trim()
            let nick = eachBlock.getAttribute("nick")?.trim()
            let template = eachBlock.innerHTML
            let contents = []
            let targetList = eval(call)
            targetList.forEach(item => {
                let newTemplate = template
                let callStack = []
                let callCount = newTemplate.split("{").length - 1
                let offset = 0
                for (let i = 0; i < callCount; i ++) {
                    let index = newTemplate.indexOf("{")
                    let evalStr = ""
                    for (let k = index + offset + 1; k < newTemplate.length; k++) {
                        if (template.split("")[k] !== "}") {
                            evalStr += template.split("")[k]
                        }
                        else {
                            newTemplate = newTemplate.replace("{", "")
                            newTemplate = newTemplate.replace("}", "")
                            offset += 2
                            break
                        }
                    }
                    try {
                        callStack.push([evalStr, eval(evalStr.replaceAll(nick, "item"))])
                    }
                    catch (error) {
                        callStack.push([evalStr, "error"])
                    }
                }
                callStack.forEach(call => {
                    newTemplate = newTemplate.replace(call[0], call[1])
                })
                contents.push(newTemplate)
            })
            console.log(contents)
            eachBlock.innerHTML = contents.join("\n")
        })
    },
    refreshStorageDisplays() {
        document.querySelectorAll('[ui="storage"]').forEach(storageCall => {
            storageCall.innerHTML = store.get(storageCall.getAttribute("val"))
        })
    },
}

const store = {
    key: "development",
    get: key => {
        let storageString = localStorage.getItem("storage_" + store.key) ? localStorage.getItem("storage_" + store.key) : "{}"
        let val = ""
        try {
            let json = JSON.parse(storageString)
            val = json[key]
        } catch (error) { 
            console.error(error)
        }
        if (val !== undefined) {
            return val
        }
        else {
            return false
        }
    },
    set: (key, val) => {
        let storageString = localStorage.getItem("storage_" + store.key) ? localStorage.getItem("storage_" + store.key) : "{}"
        try {
            let json = JSON.parse(storageString)
            json[key] = val
            localStorage.setItem("storage_" + store.key, JSON.stringify(json))
        } catch (error) { 
            return false
        }
        refreshStorageDisplays()
    },
    safety: (key, val) => {
        let res = store.getStorage(key)
        if (!res) store.setStore(key, val)
    }
}

window.addEventListener("load", () => {
    let page
    new View("Main.vwi", val => {
        document.body.innerHTML = val
    })
})