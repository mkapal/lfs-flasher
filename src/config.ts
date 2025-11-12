import * as path from "node:path";
import * as process from "node:process";

import { z } from "zod";
import { loadConfigSync as loadZodConfig } from "zod-config";
import { tomlAdapter } from "zod-config/toml-adapter";

import { createLog } from "./log";

const log = createLog();

const configSchema = z.object({
  host: z.string().min(1).optional().default("127.0.0.1"),
  port: z.number().min(1).max(65535),
  admin: z.string().min(0).max(16).optional().default(""),
});

export function loadConfig() {
  const config = loadZodConfig({
    schema: configSchema,
    adapters: [
      tomlAdapter({
        path: path.join(process.cwd(), "config.txt"),
      }),
      tomlAdapter({
        path: path.join(process.cwd(), "config.local.txt"),
        silent: true,
      }),
    ],
    onError: (error) => {
      log.error("Error loading configuration:");
      log.error(
        error.issues
          .map(({ path, message }) => `- ${path.join(" -> ")}: ${message}`)
          .join("\n"),
      );
      process.exit(1);
    },
  });

  log.success("Configuration loaded");

  log.debug(`Host: ${config.host}`);
  log.debug(`Port: ${config.port}`);
  log.debug(`Admin: ${config.admin ? "***" : "[empty]"}`);

  return config;
}
