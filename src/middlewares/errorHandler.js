
export const errorHandler = (err, req, res, next) => {
  const status = err.status ?? 500;
  const message = err.status ? err.message : 'Something went wrong';

  res.status(status).json({
    status,
    message,
    data: err.message,
  });
};
