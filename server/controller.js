const fs = require('fs')
const path = require('path')
const nanoid = require('nanoid')
const utils = require('./utils')

const Entry = require('./entry')

const BASE = "../uploads/"

const generateFilename = () => {
    const genid = nanoid.customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10)
    return genid()
}

exports.getFile = async (req, res) => {
    const uniquePath = req.query.file
    const password = req.query.password

    try {
        const foundEntry = await Entry.findOne({ path: uniquePath });

        if (foundEntry.comparePassword(password)) {
            console.log("Correct password");
        } else {
            res.code(401).send({
                "error": "Wrong password"
            })
        }
    } catch(err) {
        res.code(404).send({
            "error": "No such file found"
        });
    }

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
    
    // To-Do: Delete original file

    if (response.status == 200) {
        console.log("Successful encryption")
    } else {
        console.log("Encryption failed " + response.data)
        res.code(500).send({
            "error": "Encryption failed"
        })
    }

    // Create entry in DB for nanoid, path and password's hash
    try {
        await Entry.create({
            path: uniquePath,
            password: password
        });

        return {
            "message": "File upload successful",
            "path": uniquePath
        }
    } catch(err) {
        res.code(500).send({
            "error": "Entry creation failed"
        });
    }
}