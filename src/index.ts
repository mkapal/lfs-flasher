import chalk from "chalk";
import { InSim } from "node-insim";
import {
  InSimFlags,
  IS_ISI_ReqI,
  PacketType,
  UserType,
} from "node-insim/packets";

import { loadConfig } from "./config";

const config = loadConfig();

const inSim = new InSim();
inSim.connect({
  IName: "Flasher",
  Host: config.host,
  Port: config.port,
  Admin: config.admin,
  Flags: InSimFlags.ISF_LOCAL,
  ReqI: IS_ISI_ReqI.SEND_VERSION,
});

inSim.on(PacketType.ISP_VER, (packet) => {
  if (packet.ReqI !== IS_ISI_ReqI.SEND_VERSION) {
    return;
  }

  console.log(
    chalk.green(`Connected to LFS ${packet.Product} ${packet.Version}`),
  );
  console.log(
    `Use ${chalk.whiteBright("/o flash")} to flash your low/high beams`,
  );
});

const flashCount = 6;
const interval = 100;

inSim.on(PacketType.ISP_MSO, (packet) => {
  if (packet.UserType === UserType.MSO_O) {
    switch (packet.Msg) {
      case "flash": {
        let count = 0;

        function flashCycle() {
          if (count >= flashCount) {
            count = 0;
            return;
          }

          inSim.sendMessage("/light head low");
          setTimeout(() => {
            inSim.sendMessage("/light head high");
            count++;
            setTimeout(flashCycle, interval);
          }, interval);
        }

        flashCycle();
        break;
      }
    }
  }
});

inSim.on("disconnect", () => {
  console.log("Disconnected from LFS");
  process.exit(1);
});

process.on("SIGINT", () => {
  inSim.disconnect();
  process.exit(0);
});

process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:");
  console.error(chalk.red(err));
  inSim.disconnect();
  process.exit(1);
});
