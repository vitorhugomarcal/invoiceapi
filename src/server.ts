import { app } from "./app"

app
  .listen({
    // host: "192.168.1.142",
    host: "0.0.0.0",
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
  })
  .then(() => {
    console.log(`🚀 HTTP Server listening on port ${process.env.PORT}.`)
  })
