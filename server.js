import app from "./src/app.js";
import config from "./src/config/environment.js";
const { PORT } = config;

app.listen(PORT, () => {
  console.log(`server run on http://localhost:${PORT}`);
});
