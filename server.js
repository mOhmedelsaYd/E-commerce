const path = require('path');
const cors = require('cors');
const compression = require('compression');
const express = require('express');
const rateLimiter = require('express-rate-limit');
const app = express();
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean')

dotenv.config({path: './config.env'});
const dbConnection = require('./config/database');
const apiError = require('./utils/apiError');
const globalError = require('./middleware/errorMiddleware');
const mountRoute = require('./routes');
const { webhookCheckout } = require('./controllers/orderController');

// connect with database 
dbConnection();


// middleware
app.use(cors());// enable frontend to access your api (enable other domain from acces your)
app.options('*', cors());



// Limit each IP to 100 requests per `window` (here, per 15 minutes).
const limiter = rateLimiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
    message: 'Too many request from this ip, please try again after an 15 min'

})

// Apply the rate limiting middleware to all requests.
app.use('/api/v1/auth/forgetPassword', limiter)

// compress all response
app.use(compression());

// Middleware to protect against HTTP Paramter Population attacks  if you play in params in url
app.use(hpp({whitelist: ['price']}))  // if i use sort two time will return array not string what cause execption for that use hpp()
// and wishlist for if use price two time with hpp only will apply the last one if I want to apply two without any execption use wishlist

// to apply data sanitize
app.use(mongoSanitize()); // from query injection
app.use(xss()) // to convert any script in js or html to string // from scripting



// webhook checkout
app.post('/webhook-checkout', express.raw({ type: 'application/json' }), webhookCheckout)


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json({limit: '20kb'})); // because may the attacker send req body with large size which fill memory and disk server and the stop the website
app.use(express.static(path.join(__dirname, 'uploads')));

// morgan middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
    console.log(`mode: ${process.env.NODE_ENV}`);
}


// route 
mountRoute(app)

app.all('*', (req, res, next) => {
    // const err = new Error(`can't find this route: ${req.originalUrl}`); // create error for not exists route and pass them to global handling to cutomize them
    // next(err.message);

    next(new apiError(`can't find this route: ${req.originalUrl}`, 400))
})
// error global handling middleware   (take error from asyncHandler and customize them)
app.use(globalError)



const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`app running at port ${port}`);
})

// handle unhanledError error outside express (handling error outside express)
process.on('unhandledRejection', (err) => {
    console.error(`unhanldedRejection Errors: ${err.name} | ${err.message}`)
    server.close(() => {  // lock server first which exist building req after them close server then close process
        console.error(`Shuting down....`)
        process.exit(1);
    })
})