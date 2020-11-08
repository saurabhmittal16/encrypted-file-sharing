const axios = require('axios')

SERVICE_URL = 'http://localhost:8081/'


exports.encryptFile = async (path, password) => {
    return axios.post(SERVICE_URL + "encrypt", {
        path: path,
        password: password
    })
}

exports.decryptFile = async (path, password) => {
    return axios.post(SERVICE_URL + "decrypt", {
        path: path,
        password: password
    })
}