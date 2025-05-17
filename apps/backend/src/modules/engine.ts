import z from "zod";
import { publicProcedures } from "@lib/procedures";

export const startEngine = publicProcedures
  .route({
    method: "POST",
    path: "/engine/start",
    description: "It will start workflow engine for specified definition with addition of global params",
    summary: "Workflow Engine Start",
  })
  .input(
    z.object({
      workflowDefinitionId: z.string().describe("Workflow Definition Id"),
      globalParams: z.record(z.string(), z.any()).describe("Workflow GlobalParams").optional(),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        ok: z.boolean(),
      }),
    })
  )
  .handler(async ({ context, input }) => {
    return {
      data: {
        ok: true,
      },
      message: "Workflow",
    };
  });
