import exphbs from "express-handlebars";
import userRoutes from "./users.js";
import institutionRoutes from "./institutions.js";
import petRoutes from "./pets.js";
import loginRoutes from "./login.js";
import appointmentRoutes from "./appointments.js";
import postRoutes from "./posts.js";

const constructorMethod = (app) => {
  // app.use("/register", userRoutes);
  app.use("/institution_register", institutionRoutes);
  app.use("/pets", petRoutes);
  app.use("/getapp", appointmentRoutes);
  app.use("/posts", postRoutes);
  app.use("/", loginRoutes);
  app.use("/users", userRoutes);

  app.get("/home", async (req, res) => {
    // const institutions = await institutionData.getAll();
    // console.log(institutions);
    res.render("home/index");
  });

  // app.use("*", (req, res) => {
  //   res.status(404).json({ error: "Not found" });
  // });
};

export default constructorMethod;
