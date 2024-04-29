import express from "express";
const app = express();
import configRoutesFunction from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import cors from 'cors';

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }

  // let the next middleware run:
  next();
};
app.use("/public", express.static("public"));

app.use("/institutionapp/public", express.static("public"));
app.use(express.json());
app.use(cors());
app.use(
  session({
    name: "AuthenticationState",
    secret: "This is a secret.. shhh don't tell anyone",
    saveUninitialized: false,
    resave: false,
    // cookie: { maxAge: 60000 },
  })
);

app.use((req, res, next) => {
  const timestamp = new Date().toUTCString();
  const method = req.method;
  const route = req.originalUrl;
  const isAuthenticated =
    req.session && req.session.user
      ? "Authenticated User"
      : "Non-Authenticated User";
  console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated})`);
  next();
});

// app.use((req, res, next) => {
//   if (req && req.session && req.session.user) {
//     next();
//   } else {
//     res.redirect("/userLogin");
//   }
// });

// app.use((req, res, next) => {
//   if (req && req.session && req.session.institution) {
//     next();
//   } else {
//     res.redirect("/institutionLogin");
//   }
// });

app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", exphbs.engine({ defaultLayout: "main", partialsDir: ['views/partials/'] }));
app.set("view engine", "handlebars");

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
