import express from "express";
import session from "express-session";
import exphbs from "express-handlebars";
const app = express();
import configRoutes from "./routes/index.js";

import {
  logger,
  loginRedirect,
  registerRedirect,
  protectHomePage,
  protectSignoutPage,
  protectIncomePage,
  protectExpensePage,
  protectSettingsPage,
} from "./middleware.js";
     

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  next();
};

const staticDir = express.static("public");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  helpers: {
    asJSON: (obj, spacing) => {
      if (typeof spacing === "number")
        return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

      return new Handlebars.SafeString(JSON.stringify(obj));
    },
    partialsDir: ["views/partials/"],
  },
});

// Register the Handlebars "eq" helper for comparison
handlebarsInstance.handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

app.use(
  session({
    name: "AuthenticationState",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(rewriteUnsupportedBrowserMethods);

app.engine("handlebars", handlebarsInstance.engine);
app.set("view engine", "handlebars");

app.use(logger);

app.use("/login", loginRedirect);
app.use("/register", registerRedirect);
app.use("/home", protectHomePage);
app.use("/yearly", protectHomePage);
app.use("/signout", protectSignoutPage);
app.use("/income", protectIncomePage);
app.use("/expense", protectExpensePage);
app.use("/settings", protectSettingsPage);



configRoutes(app);


app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});