const express = require('express')
const router = express.Router()
const cardCont = require('../controller/cardController')


router.get('/',cardCont.getCard)

module.exports = router

