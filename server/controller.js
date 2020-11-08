exports.getFile = async (req, res) => {
    return {
        "message": "Here is your file"
    }
}

exports.createNew = async (req, res) => {
    return {
        "message" : "Saved your file"
    }
}