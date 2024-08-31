import { app } from "./app"
import { env } from "./env"

app
  .listen({
    host: "192.168.1.142",
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀 Server is running!`)
  })
