const  jwt = require('jsonwebtoken');

module.exports=function(req, res, next) {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, process.env.SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: 'Invalid Token' });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: 'Token is not supplied.' });
  }
  // if (!token) return res.status(401).send('Access denied. No token provided.');

  // try {
  //   const decoded = jwt.verify(token, process.env.SECRET);
  //   req.user = decoded; 
  //   next();
  // }
  // catch (ex) {
  //   res.status(400).send('Invalid token.');
  // }
};
