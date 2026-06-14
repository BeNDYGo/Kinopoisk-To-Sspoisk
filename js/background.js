const ID_STORAGE_KEY = "kts-userID"
const APIURL = "https://github.com/BeNDYGo/Kinopoisk-To-Sspoisk-API"
const BackURL = "http://45.67.131.104:8100"


function generateUserID() {
    return crypto.randomUUID()
}

async function saveUserID(userID){
    chrome.storage.sync.set({ [ID_STORAGE_KEY]: userID }, () => {
        console.log("[KTS] ID сохранен:", userID)
    })
}


async function getUserID() {
    return new Promise((resolve) => {
        chrome.storage.sync.get([ID_STORAGE_KEY], (result) => {
            resolve(result[ID_STORAGE_KEY] || null)
        })
    })
}

async function registerUserID(userID) {
    try {
        const response = await fetch(BackURL + "/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: userID
            })
        })
        
        if (!response.ok) {
            console.error("[KTS] Ошибка регистрации:", response.status)
            return
        }
        
        const data = await response.json()
        console.log("[KTS] Регистрация успешна:", data)
    } catch (error) {
        console.error("[KTS] Ошибка отправки UserID:", error)
    }
}

async function startExtension(){
    const existingID = await getUserID()
    
    if (!existingID) {
        const userID = generateUserID()
        
        await saveUserID(userID)
        await registerUserID(userID)
    } else {
        console.log("[KTS] ID уже существует:", existingID)
    }
}


chrome.runtime.onInstalled.addListener(() => startExtension())