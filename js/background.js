const ID_STORAGE_KEY = "kts-userID"
const EMAIL_STORAGE_KEY = "kts-userEmail"
const BackURL = "http://api.kinopoisk-to-sspoisk.online:8100"


function generateUserID() {
    return crypto.randomUUID()
}

async function saveUserID(userID){
    return new Promise(resolve => {
        chrome.storage.sync.set({ [ID_STORAGE_KEY]: userID }, () => {
            console.log("[KTS] ID сохранен:", userID)
            resolve()
        })
    })
}

async function saveEmail(email){
    return new Promise(resolve => {
        chrome.storage.sync.set({ [EMAIL_STORAGE_KEY]: email }, () => {
            console.log("[KTS] Email сохранен:", email)
            resolve()
        })
    })
}


async function getUserID() {
    return new Promise((resolve) => {
        chrome.storage.sync.get([ID_STORAGE_KEY], (result) => {
            resolve(result[ID_STORAGE_KEY] || null)
        })
    })
}

async function firstPingUser(userID) {
    try {
        const response = await fetch(BackURL + "/firstPing", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userID: userID
            })
        })
        
        if (!response.ok) {
            console.error("[KTS] Ошибка firstPing:", response.status)
            return
        }
        
        const data = await response.json()
        console.log("[KTS] FirstPing успешен:", data)
    } catch (error) {
        console.error("[KTS] Ошибка firstPing:", error)
    }
}

async function startExtension(){
    const existingID = await getUserID()
    
    if (!existingID) {
        const userID = generateUserID()
        
        await saveUserID(userID)
        await firstPingUser(userID)
    } else {
        console.log("[KTS] ID:", existingID)
        await firstPingUser(existingID)
    }
}


async function requestMovieToBackend(endpoint, userID, movie) {
    try {
        const response = await fetch(BackURL + endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userID,
                movie: { url: movie.url, filmId: movie.filmId, type: movie.type, title: movie.title, poster: movie.poster }
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

async function fetchAllMoviesFromBackend(userID) {
    try {
        const response = await fetch(BackURL + "/getAllMovie/" + userID)
        if (!response.ok) {
            console.error("[KTS] Ошибка получения фильмов:", response.status)
            return []
        }
        const data = await response.json()
        console.log("[KTS] Фильмы получены:", data.length)
        return data
    } catch (error) {
        console.error("[KTS] Ошибка получения фильмов:", error)
        return []
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "getAllMovies") {
        (async () => {
            const userID = await getUserID()
            const movies = userID ? await fetchAllMoviesFromBackend(userID) : []
            sendResponse(movies)
        })()
        return true
    }

    if (message.type === "addMovie" || message.type === "delMovie") {
        (async () => {
            const userID = await getUserID()
            if (!userID) return
            const endpoint = message.type === "addMovie" ? "/addMovie" : "/delMovie"
            requestMovieToBackend(endpoint, userID, message.movie)
        })()
    }

    if (message.type === "register") {
        (async () => {
            const userID = await getUserID()
            if (!userID) {
                sendResponse({ success: false, error: "ID пользователя не найден" })
                return
            }
            try {
                console.log("[KTS] /register запрос:", { userID, email: message.email })
                const response = await fetch(BackURL + "/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID,
                        email: message.email,
                        password: message.password
                    })
                })
                const data = await response.json()
                console.log("[KTS] /register ответ:", response.status, data)
                if (response.status === 200) {
                    await saveEmail(message.email)
                    sendResponse({ success: true, message: data.log })
                } else if (response.status === 409){
                    sendResponse({ success: false, error: data.log })
                } else {
                    sendResponse({ success: false, error: data.log || "Ошибка регистрации" })
                }
            } catch (error) {
                console.error("[KTS] /register ошибка:", error)
                sendResponse({ success: false, error: "Ошибка соединения" })
            }
        })()
        return true
    }

    if (message.type === "login") {
        (async () => {
            const userID = await getUserID()
            if (!userID) {
                sendResponse({ success: false, error: "ID пользователя не найден" })
                return
            }
            try {
                console.log("[KTS] /login запрос:", { userID, email: message.email })
                const response = await fetch(BackURL + "/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        userID,
                        email: message.email,
                        password: message.password
                    })
                })
                const data = await response.json()
                console.log("[KTS] /login ответ:", data)
                if (data.userID === "0") {
                    sendResponse({ success: false, error: "Неверный email или пароль" })
                } else {
                    await saveUserID(data.userID)
                    await saveEmail(message.email)
                    sendResponse({ success: true, message: "Вход выполнен" })
                }
            } catch (error) {
                console.error("[KTS] /login ошибка:", error)
                sendResponse({ success: false, error: "Ошибка соединения" })
            }
        })()
        return true
    }

    if (message.type === "logout") {
        chrome.storage.sync.remove([EMAIL_STORAGE_KEY, ID_STORAGE_KEY], async () => {
            console.log("[KTS] Email и userID удалены")
            // Генерируем новый userID для анонимного использования
            const newUserID = generateUserID()
            await saveUserID(newUserID)
            await firstPingUser(newUserID)
            console.log("[KTS] Создан новый анонимный userID:", newUserID)
            sendResponse({ success: true })
        })
        return true
    }
})

chrome.runtime.onInstalled.addListener(() => startExtension())