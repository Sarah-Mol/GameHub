const validateUser = (req, res, next) => {
  const userHeader = req.headers['x-user'];

  if (!userHeader) {
    return res
      .status(403)
      .json({ error: 'Acceso no autorizado, se requiere header x-user' });
  }

  req.userName = userHeader;
  next();
};

module.exports = validateUser;
