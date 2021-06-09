require('dotenv').config();

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const http        = require('http');
const morganBody  = require('morgan-body');
const httpServer  = http.createServer(app);
const cors = require('cors');
const session = require('express-session');
const favicon = require('serve-favicon')
const path = require('path')

app.use(favicon(path.join(__dirname, 'public/assets', 'favicon.png')));



app.use(session({ secret: 'myapp', cookie: { maxAge:  24 * 60 * 60 * 1000 }}));
const routes      = require('./routes');



app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(cors());
app.use(express.static("public")); 
app.set('view engine','ejs');

morganBody(app);

app.use(function (error, req, res, next) {
  if (error instanceof SyntaxError) {
    return res.status(500).send({ message: "Invalid data structure. Please read documentation carefully." });
  } else {
    next();
  }
});

app.disable('x-powered-by');

app.use(routes);



const port  = process.env.PORT || process.env.SERVICE_PORT;

httpServer.listen(port);

console.log(process.env.SERVICE_NAME + " started on port " + port);

module.exports = app;