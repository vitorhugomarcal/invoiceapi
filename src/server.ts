import { app } from "./app"
import { env } from "./env"

app
  .listen({
    // host: "192.168.1.142",
    host: "0.0.0.0",
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 HTTP Server listening on port ${env.PORT}.`)
  })
