import { connectDatabase, disconnectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { app } from "./app.js";
import { logger } from "./utils/logger.js";

async function startServer(): Promise<void> {
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV
      },
      "Backend server started"
    );
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info({ signal }, "Shutdown signal received");

    server.close(async (serverError) => {
      if (serverError) {
        logger.error({ err: serverError }, "Error while closing HTTP server");
        process.exitCode = 1;
      }

      try {
        await disconnectDatabase();
      } catch (databaseError) {
        logger.error(
          { err: databaseError },
          "Error while disconnecting from MongoDB"
        );
        process.exitCode = 1;
      }
    });
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

startServer().catch((error: unknown) => {
  logger.fatal({ err: error }, "Backend failed to start");
  process.exit(1);
});
