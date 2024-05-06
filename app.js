import express from "express";
const app = express();
import configRoutesFunction from "./routes/index.js";
import exphbs from "express-handlebars";
import session from "express-session";
import cors from "cors";
import { postMiddleware } from "./postsMiddleware.js";

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
    req.session && (req.session.user || req.session.institution)
      ? "Authenticated User"
      : "Non-Authenticated User";
  console.log(`[${timestamp}]: ${method} ${route} (${isAuthenticated})`);
  next();
});

app.get("/", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  else if (req.session.institution) bool = "Authenticated Institution";
  if (bool === "Authenticated User") {
    return res.redirect("/home");
  } else if (bool === "Authenticated Institution") {
    return res.redirect("/institutionDashboard");
  }
  next();
});

app.get("/userLogin", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  else if (req.session.institution) bool = "Authenticated Institution";
  if (bool === "Authenticated User") {
    return res.redirect("/home");
  } else if (bool === "Authenticated Institution") {
    return res.redirect("/institutionDashboard");
  }
  next();
});

app.get("/users", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  else if (req.session.institution) bool = "Authenticated Institution";
  if (bool === "Authenticated User") {
    return res.redirect("/home");
  } else if (bool === "Authenticated Institution") {
    return res.redirect("/institutionDashboard");
  }
  next();
});

app.get("/forgotPassword/userReset", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  else if (req.session.institution) bool = "Authenticated Institution";
  if (bool === "Authenticated User") {
    return res.redirect("/home");
  } else if (bool === "Authenticated Institution") {
    return res.redirect("/institutionDashboard");
  }
  next();
});

app.get("/institutionLogin", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  else if (req.session.institution) bool = "Authenticated Institution";
  if (bool === "Authenticated User") {
    return res.redirect("/home");
  } else if (bool === "Authenticated Institution") {
    return res.redirect("/institutionDashboard");
  }
  next();
});

app.get("/logout", async (req, res, next) => {
  let bool = "Non Authenticated User";
  if (req.session.user || req.session.institution) bool = "Authenticated User";
  if (bool === "Non Authenticated User") {
    return res.redirect("/");
  } else {
    next();
  }
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
app.use("/posts", postMiddleware);

app.engine(
  "handlebars",
  exphbs.engine({ defaultLayout: "main", partialsDir: ["views/partials/"] })
);
app.set("view engine", "handlebars");

configRoutesFunction(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
