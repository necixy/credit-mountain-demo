module.exports = errorHandler;

function errorHandler(err, req, res, next) {
  console.log(err);
  switch(true) {
    case typeof err === 'string':
      const is404 = err.toLowerCase().endsWith('not found');
      const statusCode = is404 ? 404 : 400;
      return res.status(statusCode).json({message: err, data: {}, success: false});
    
    case err.name === 'ValidationError':
      return res.status(400).json({message: err, data: {}, success: false});

    case err.name === 'UnauthorizedError':
      return res.status(401).json({message: err, data: {}, success: false});

    default:
      return res.status(500).json({message: err, data: {}, success: false});

  }
}