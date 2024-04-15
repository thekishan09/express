function expressConfiguration(app, express) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("Running on port", PORT);
  });
  app.use(express.json());
}

export default expressConfiguration;
