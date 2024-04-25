import exphbs from "express-handlebars";
import userRoutes from "./users.js";
import institutionRoutes from "./institutions.js";
import petRoutes from "./pets.js";
import loginRoutes from "./login.js";

const constructorMethod = (app) => {
  // app.use("/register", userRoutes);
  app.use("/institution_register", institutionRoutes);
  app.use("/pets", petRoutes);
  app.use("/", loginRoutes);
  app.use("/users", userRoutes);

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
