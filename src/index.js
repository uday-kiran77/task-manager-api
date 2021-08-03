const express= require('express')
require("./db/mongoose")

//route handlers
const userRouter=require('./routes/user')
const taskRouter=require('./routes/task')

const app=express()
const port=process.env.PORT || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port,()=>{
console.log("listening on port "+ port)
})


// const User=require('./models/user')
// const Task=require('./models/task')

