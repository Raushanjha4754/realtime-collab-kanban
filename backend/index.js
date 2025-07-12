const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

//config
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000

//mddlewares
app.use(cors())
app.use(express.json())

//test route
app.get('/', (req, res) => {
    res.send('API is running ........')
})

const authRoutes = require('./routes/authRoutes')
app.use('/api/auth', authRoutes)

//connect MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log('MongoDB connected')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
.catch((err) => {
    console.error(`MongoDB connection error:`, err.message)
})