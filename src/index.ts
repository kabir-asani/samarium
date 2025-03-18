import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (context) => {
  return context.json({ message: "Hello, World!" }, 200);
});

serve(app, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});
