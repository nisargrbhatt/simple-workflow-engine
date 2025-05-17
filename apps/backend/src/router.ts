import { createDefinition } from "@modules/definition";
import { startEngine } from "@modules/engine";

export const router = {
  engine: {
    start: startEngine,
  },
  definition: {
    create: createDefinition,
  },
};
