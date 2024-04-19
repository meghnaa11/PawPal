import { Router } from "express";
const router = Router();
import { userData } from "../data/index.js";

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userData.getUserById(id);
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

router.post("/update/:id", async (req, res) => {
  try {
    const updatedUser = req.body;
    const id = req.params.id;
    const result = await userData.updateUser(id, updatedUser);
    if (result === null) {
      return res.status(404).json({ error: "User not found" });
    }
    res.redirect("/userDashboard");
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

router.get("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await userData.getUserById(id);
    res.render("updateUser", { user });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

export default router;
