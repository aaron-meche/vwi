
const project_key = "speed_design"

function getStorage(key) {
    let text = localStorage.getItem("storage_" + project_key) ? localStorage.getItem("storage_" + project_key) : "{}"
    let json = JSON.parse(text)
    let val = json[key]
    if (val !== undefined) {
        return val
    }
    else {
        return false
    }
}

function setStore(key, val) {
    let text = localStorage.getItem("storage_" + project_key) ? localStorage.getItem("storage_" + project_key) : "{}"
    let json = JSON.parse(text)
    json[key] = val
    localStorage.setItem("storage_" + project_key, JSON.stringify(json))
    refreshStorageDisplays()
}

function safetyStore(key, val) {
    let res = getStorage(key)
    if (!res) setStore(key, val)
}