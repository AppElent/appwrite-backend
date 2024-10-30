const authMiddleware = (req, __, log) => {
  const { token } = req.headers;
  if (!token) {
    log("No token");
  } else {
    log("Token found");
  }
};

export default authMiddleware;
