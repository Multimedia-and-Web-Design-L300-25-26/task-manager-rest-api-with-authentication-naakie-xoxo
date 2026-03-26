import app from "./src/app.js";

// We already loaded the .env in app.js, so we can just use the PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});