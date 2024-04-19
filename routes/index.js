import loginRoutes from "./login.js";
import userRoutes from "./users.js";

const constructorMethod = (app) => {
  app.use("/", loginRoutes);
  app.use("/users", userRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "No route found" });
  });
};

export default constructorMethod;
