const postMiddleware = (req, res, next) => {
  // let the next middleware run:

  let bool = "Non Authenticated User";
  if (req.session.user) bool = "Authenticated User";
  if (bool === "Non Authenticated User") {
    return res.redirect("/");
  }
  if (req._method === "DELETE") req.method = "DELETE";
  if (req._method === "PUT") req.method = "PUT";
  next();
};

export { postMiddleware };
