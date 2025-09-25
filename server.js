const { PORT } = require("./src/config/environment");
const app = require("./src/app");

app.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});
