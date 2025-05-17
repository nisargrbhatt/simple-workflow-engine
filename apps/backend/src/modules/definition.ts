import { db } from "@db/index";
import { definitionTable } from "@db/schema";
import { publicProcedures } from "@lib/procedures";
import { safeAsync } from "@lib/safe";
import z from "zod";

export const createDefinition = publicProcedures
  .route({
    method: "POST",
    path: "/definition/create",
    description: "It will create a new workflow definition",
    summary: "Create Definition",
    successStatus: 201,
  })
  .input(
    z.object({
      name: z.string().trim().min(1, "Name is required"),
      description: z.string().trim().min(1, "Description is required"),
      type: z.enum([definitionTable.type.enumValues[0], definitionTable.type.enumValues[1]]),
      global: z.record(z.string(), z.any()),
      status: z.enum([definitionTable.status.enumValues[0], definitionTable.status.enumValues[1]]).default("active"),
      uiObject: z.record(z.string(), z.any()),
      tasks: z.record(z.string(), z.any()),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        id: z.number().describe("Created Definition Id"),
      }),
    })
  )
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: "Create Definition failed",
    },
    BAD_REQUEST: {
      message: "Can't create definition",
    },
  })
  .handler(async ({ input, errors }) => {
    const createdDefinitionResult = await safeAsync(
      db.insert(definitionTable).values(input).returning({
        id: definitionTable.id,
      })
    );

    if (!createdDefinitionResult.success) {
      console.error(createdDefinitionResult.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Create Definition failed",
      });
    }

    const createdDefinitionId = createdDefinitionResult.data?.at(0)?.id;

    if (typeof createdDefinitionId !== "number") {
      throw errors.BAD_REQUEST({
        message: "Can't create definition",
      });
    }

    return {
      message: "Definition created successfully",
      data: {
        id: createdDefinitionId,
      },
    };
  });
