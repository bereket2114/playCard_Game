const path = require('path')

module.exports ={
    getCard: async (req,res)=>{
        res.sendFile(path.join(__dirname,'..','view','cardGame.html'))
        console.log("We're sending the file you asking for!")
        console.log(req.ip)
    }
}