import userRoutes from "./users.js";
import institutionRoutes from "./institutions.js";
import petRoutes from "./pets.js";
import loginRoutes from "./login.js";
import appointmentRoutes from "./appointments.js";
import postRoutes from "./posts.js";
import institutionappRoutes from "./institutionapp.js";
import { institutionData } from "../data/index.js";
import forgotPasswordRoutes from "./forgot-password.js";
const constructorMethod = (app) => {
  // app.use("/register", userRoutes);
  app.use("/institution_register", institutionRoutes);
  app.use("/pets", petRoutes);
  app.use("/getapp", appointmentRoutes);
  app.use("/posts", postRoutes);
  app.use("/", loginRoutes);
  app.use("/users", userRoutes);
  app.use("/institutionapp", institutionappRoutes);
  app.use("/forgotPassword", forgotPasswordRoutes);

  app.get("/home", async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
    const institutions = await institutionData.getAll();

    let ins = [];
    for (let i = 0; i < 4; i++) {
      ins.push(institutions[i]);
    }

    res.render("home/index", { institutions: ins });
  });

  // app.use("*", (req, res) => {
  //   res.status(404).json({ error: "Not found" });
  // });
};

export default constructorMethod;
