const ID_STORAGE_KEY = "kts-userID"
const BackURL = "http://api.kinopoisk-to-sspoisk.online:8100"


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


async function requestMovieToBackend(endpoint, userID, movie) {
    try {
        const response = await fetch(BackURL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID,
                movie: { url: movie.url, title: movie.title, poster: movie.poster }
            })
        })

        if (!response.ok) {
            console.error(`[KTS] Ошибка ${endpoint}:`, response.status)
            return
        }

        const data = await response.json()
        console.log(`[KTS] ${endpoint} выполнен:`, data)
    } catch (error) {
        console.error(`[KTS] Ошибка ${endpoint}:`, error)
    }
}

chrome.runtime.onMessage.addListener(async (message) => {
    const userID = await getUserID()

    if (message.type === "addMovie") {
        if (userID) {
            requestMovieToBackend("/addMovie", userID, message.movie)
        }
    } else if (message.type === "delMovie"){
        if (userID) {
            requestMovieToBackend("/delMovie", userID, message.movie)
        }
    }
})

chrome.runtime.onInstalled.addListener(() => startExtension())