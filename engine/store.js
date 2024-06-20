
const project_key = "speed_design"

const store = {
    key: "development",
    get: key => {
        let text = localStorage.getItem("storage_" + project_key) ? localStorage.getItem("storage_" + project_key) : "{}"
        let json = JSON.parse(text)
        let val = json[key]
        if (val !== undefined) {
            return val
        }
        else {
            return false
        }
    },
    set: (key, val) => {
        let text = localStorage.getItem("storage_" + project_key) ? localStorage.getItem("storage_" + project_key) : "{}"
        let json = JSON.parse(text)
        json[key] = val
        localStorage.setItem("storage_" + project_key, JSON.stringify(json))
        refreshStorageDisplays()
    },
    safety: (key, val) => {
        let res = getStorage(key)
        if (!res) setStore(key, val)
    }
}