import express from "express";
const app = express();
import configRoutesFunction from "./routes/index.js";
import exphbs from 'express-handlebars';
import session from 'express-session';

// const rewriteUnsupportedBrowserMethods = (req, res, next) => {
//   // If the user posts to the server with a property called _method, rewrite the request's method
//   // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
//   // rewritten in this middleware to a PUT route
//   if (req.body && req.body._method) {
//     req.method = req.body._method;
//     delete req.body._method;
//   }

//   // let the next middleware run:
//   next();
// };
app.use(
  session({
    secret: "key",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 60000 }
  })
);
app.use('/public', express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(rewriteUnsupportedBrowserMethods);

app.engine('handlebars', exphbs.engine({
  defaultLayout: 'main',
  partialsDir: ['views/partials/']
}));
app.set('view engine', 'handlebars');


configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
