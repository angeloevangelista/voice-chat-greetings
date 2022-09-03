import express from "express";

const app = express();
const port = process.env.PORT || 3333;

app.get("/", (request, response) => {
  return response.json({ message: "Hello, World!" });
});

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});

export default app;
