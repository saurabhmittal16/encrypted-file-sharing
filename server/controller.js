const fs = require('fs')
const path = require('path')
const nanoid = require('nanoid')
const utils = require('./utils')

const BASE = "../uploads/"

const generateFilename = () => {
    const genid = nanoid.customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)
    return genid()
}

exports.getFile = async (req, res) => {
    return {
        "message": "Here is your file"
    }
}

exports.createNew = async (req, res) => {    
    const file = req.body.file;
    
    const buffer = await file.toBuffer();
    const extension = path.extname(file.filename);
    const password = await req.body.password.value;

    const uniquePath = generateFilename()
    const finalPath = BASE + uniquePath + extension;

    fs.writeFile(finalPath, buffer, (err) => {
        if (err) {
            res.code(500).send({
                "error": "Invalid file sent"
            })
        }
    });

    // Pass this path to the encryption service
    // Receive final saved path in response

    const response = await utils.encryptFile(finalPath, password)
    if (response.status == 200) {
        console.log("Successful encryption")
    } else {
        console.log("Encryption failed " + response.data)
        res.code(500).send({
            "error": "Encryption failed"
        })
    }

    const encryptedPath = response.data
    // Create entry in DB for nanoid, path and password's hash
    
    res.send({
        "message" : "Saved your file"
    });
}