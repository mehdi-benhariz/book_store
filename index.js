const express = require('express')
const app = express()
const port = 3000
const db = require("./models/db");
const seed = require('./models/seed/seed-db');

app.use('/api/user',require('./routers/userRoute') );
app.get('/', (req, res) => res.send('Hello World!'));


db.sequelize.sync({force:true})
.then(()=>seed.insert())
.then(()=>{
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}).catch((err)=>console.log(err))

module.exports = app;