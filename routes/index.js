import institutionRoutes from './institutions.js';
import appointmentRoutes from './appointments.js';

import * as institutionData from '../data/institutions.js';

const constructorMethod = (app) => {



  app.use('/institution', institutionRoutes);
  app.use('/getapp', appointmentRoutes);

  app.get("/", async (req, res) => {
    const institutions = await institutionData.getAll();
    console.log(institutions);
    res.render('home/index', { institutions: institutions });

  });

  // app.use("*", (req, res) => {
  //   res.status(404).json({ error: "Not found" });
  // });
};

export default constructorMethod;
