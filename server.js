const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3500;
const app = express();
const {logger} = require('./middleware/logEvents');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions')
const {verifyJWT} = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');

app.use(credentials);
app.use(cors(corsOptions));

// custom middleware
app.use(logger);

// built in middlewares
app.use(express.urlencoded({extended:false}))
app.use(express.json())

app.use(cookieParser())
// serve static files
app.use(express.static(path.join(__dirname,'public')))

app.use('/',require('./routes/root')); 
app.use('/register', require('./routes/register'))
app.use('/auth', require('./routes/auth'))
app.use('/refresh', require('./routes/refreshToken'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees',require('./routes/api/employees'))

//handle 404
app.all('*', (req, res) =>{
    if(req.accepts('html')){
        res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    }else if(req.accepts('json')){
        res.json({ error: "404 not found" });
    }else{
        res.type('txt').send("404 not found");
    }
});


app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running o port ${PORT}`));


