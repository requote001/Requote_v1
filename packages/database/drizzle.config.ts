export default {
  schema: "./src/schema/**/*.ts",
  out: "./migrations",
  dialect: "postgresql",
  strict: true,
  verbose: true,
};
