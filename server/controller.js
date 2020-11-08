const fs = require('fs')
const path = require('path')
const nanoid = require('nanoid')

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
    const file = await req.body.file;
    
    const buffer = file.toBuffer();
    const extension = path.extname(file.filename);
    const password = await req.body.password.value;

    const uniquePath = generateFilename()
    const finalPath = BASE + uniquePath + extension;

    fs.writeFileSync(finalPath, buffer, (err) => {
        if (err) {
            res.code(500).send({
                "error": "Invalid file sent"
            })
        }
    });

    // Pass this path to the encryption service
    // Receive final saved path in response
    // Create entry in DB for nanoid, path and password's hash
    
    res.send({
        "message" : "Saved your file"
    });
}