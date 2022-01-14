
const express = require('express');
//const {router}=require('./routes/employee-routes')
var cors = require('cors');
var swaggerUi = require("swagger-ui-express");
const swaggerDocument = require('./swagger.json');

var app = express();//create new app object

app.use(express.json());//parse application json
app.use(express.urlencoded({extended:true}))//parse application/x-www-form-urlencoded
app.use(cors());


//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));

//configure routes
app.use("/employees",require('./routes/employee-routes'));

//404 error handler (client side error)
app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


// configure error handlers (server side error)
app.use(function(err, req, res, next) {
    if (process.env,NODE_ENV=="development") {
      console.log(err.stack);
    }
    res.status(500).send({'error':'something broke!'})
    res.render('error', { error: err })
  });

module.exports=app; 
