const axios = require('axios')

SERVICE_URL = 'http://localhost:8081'

exports.encryptFile = async (path, password) => {
    return axios.post(SERVICE_URL, {
        path: path,
        password: password
    })
}