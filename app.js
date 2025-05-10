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
} from "./middleware.js";

const rewriteUnsupportedBrowserMethods = (req, res, next) => {
  // If the user posts to the server with a property called _method, rewrite the request's method
  // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
  // rewritten in this middleware to a PUT route
  if (req.body && req.body._method) {
    req.method = req.body._method;
    delete req.body._method;
  }
  // let the next middleware run:
  next();
};

const staticDir = express.static("public");

const handlebarsInstance = exphbs.create({
  defaultLayout: "main",
  // Specify helpers which are only registered on this instance.
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
    name: "AuthenticationState", // This is critical for full credit!
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
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(logger);
app.use("/login", loginRedirect);
app.use("/register", registerRedirect);
app.use("/home", protectHomePage);
app.use("/signout", protectSignoutPage);
app.use("/income", protectIncomePage);
app.use("/expense", protectExpensePage);

configRoutes(app);

//CHANGE LOCAL HOST
app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});