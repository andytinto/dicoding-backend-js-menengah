export const healthCheck = (req, res) => res.json({
  status: 'success',
  data: { message: 'OK' },
});