const express = require('express')
const app = express()
const cardRouter = require('./router/cardRoute')

require('dotenv').config({path: './config/.env'})

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.use('/', cardRouter)

app.listen(process.env.PORT,()=>{
    console.log(`the server is running on the port ${process.env.PORT}.`)
})