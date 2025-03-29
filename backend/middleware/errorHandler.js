const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res.status(error.status || 500).json({
    error: error.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;