import { createDefinition, listDefinition } from "@modules/definition";
import { startEngine } from "@modules/engine";

export const router = {
  engine: {
    start: startEngine,
  },
  definition: {
    create: createDefinition,
    list: listDefinition,
  },
};
