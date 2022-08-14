const app = require("./app");
const config = require("./config-env/config-env");
const PORT = config.app.port;

app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
