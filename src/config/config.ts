export default () => ({
  port: parseInt(process.env.PORT, 10) || 5000,
  database: {
    host: process.env.MONGO_URI,
  }
});
