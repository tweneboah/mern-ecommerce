import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/db.js';
import productRoutes from './routes/productRoutes.js';
dotenv.config();
dbConnect();

const app = express();

//404 Routes thus when the route does not exist
//Since this is not ann error handler it will run at every reques
//If there is not rpute
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  //You can't throw any message as an error unless that error is coming from our request and response
  next(error);
});

app.use((req, res, next) => {
  next();
});

app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API is running');
});

//Error middleware
//Always create it below all routes
//If you want to overide the default middile this is how we do it
//This middleware will always check if there is a value on the err object so we can create any middleware and pass the error as next(err) to this error middleware

//This middleware will catch any error we throw
app.use((err, req, res, next) => {
  //Check the status code becuase sometimes it's error but it gives 200
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is runing in ${process.env.NODE_ENV} on port ${PORT}`)
);
