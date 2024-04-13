import institutionRoutes from './institutions.js';
import appointmentRoutes from './appointments.js';



const constructorMethod = (app) => {



  app.use('/institution', institutionRoutes);
  app.use('/getapp', appointmentRoutes);

  app.get("/", (req, res) => {
    res.render('home/index', {});

  });

  // app.use("*", (req, res) => {
  //   res.status(404).json({ error: "Not found" });
  // });
};

export default constructorMethod;
