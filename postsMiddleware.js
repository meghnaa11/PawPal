const postMiddleware = (req, res, next) => {
  // let the next middleware run:
  if (req._method === "DELETE") req.method = "DELETE";
  next();
};

export { postMiddleware };
