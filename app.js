const express = require('express')
const path = require('path')
const app = express()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))


app.listen(80,()=>{
    console.log("Connected to server")
})

// database

const mysql = require('mysql')
const session = require('express-session');
var bodyParser = require('body-parser');
const alert = require('alert')
const { exit } = require('process')

app.use(bodyParser.urlencoded())
app.use(express.json())
app.use(session({
    secret:'yashwant',
    resave:'true',
    saveUninitialized:'true'
}))

const database = mysql.createConnection({
    host : 'localhost',
    user : 'yashwant',
    password : 'password',
    database : 'ecommerce'
})

database.connect((err)=>{
    if(err)
    {
        console.log('ERROR => ',err)
    }
    else
    {
        console.log('CONNECTED TO MYSQL')
    }
})

//serving

app.get('/',(req,res)=>{
    res.render('home',{session : req.session})
})

app.get('/login',(req,res)=>{
    res.render('login')
})

app.get('/contact',(req,res)=>{
    res.render('contact')
})

app.get('/signup',(req,res)=>{
    res.render('signup')
})

app.get('/cart',(req,res)=>{
    res.render('cart')
})

app.post('/signup',(req,res)=>{
    email = req.body.user_email
    password = req.body.user_password
    person = req.body.user_name 
    phone = req.body.phone
    if(email && password)
    {
        var query_to_register = `INSERT INTO ecommerce.credentials(user_name,user_email,user_password,user_phone) VALUES ('${person}','${email}','${password}','${phone}');`
        database.query(query_to_register,(err,data)=>{
            if(err)
            {
                console.log('Data not inserted',err)
            }
            else
            {
                console.log('Data inserted')
                alert("YOU are registered, Try logging in")
                res.redirect('/')
            }
        })
    }
    else
    {
        res.send('Enter both fields')
    }
})

app.post('/login',(req,res)=>{
    var bool=1
    email = req.body.user_email
    password = req.body.user_password
    if(email && password)
    {
        var query_to_login = `select * from ecommerce.credentials;`
        database.query(query_to_login,(err,data)=>{
            if(data.length>0)
            {
                for(var i=0;i<data.length;i++)
                {
                    if(data[i].user_email == email)
                    {
                        if(data[i].user_password == password)
                        {
                            req.session.user_id=data[i].user_id
                            res.redirect('/')
                            alert("LOGGED IN")
                            return
                        }
                    }
                    else
                    {
                        bool=0
                    }
                }
                if(bool==0)
                {
                    alert("Wrong Credentials")
                    res.render('login')
                }
            }
        })
    }
})


