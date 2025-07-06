import { db } from "@db/index";
import { definitionTable } from "@db/schema";
import { publicProcedures } from "@lib/procedures";
import { safeAsync } from "@lib/safe";
import { and, count, desc, eq } from "drizzle-orm";
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
      type: z.enum([definitionTable.type.enumValues[0], definitionTable.type.enumValues[1]]).default("definition"),
      global: z.array(
        z.object({
          key: z.string(),
          value: z.string(),
        })
      ),
      status: z.enum([definitionTable.status.enumValues[0], definitionTable.status.enumValues[1]]).default("active"),
      uiObject: z.record(z.string(), z.any()),
      tasks: z.array(z.record(z.string(), z.any())),
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

export const listDefinition = publicProcedures
  .route({
    method: "GET",
    path: "/definition/list",
    description: "It will list all workflow definitions",
    summary: "List Definition",
    successStatus: 200,
  })
  .input(
    z.object({
      page: z.coerce.number().optional().default(1).catch(1).describe("Page number"),
      limit: z.coerce.number().optional().default(10).catch(10).describe("Limit number"),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        list: z.array(
          z
            .object({
              id: z.number().describe("Definition Id"),
              name: z.string().describe("Definition Name"),
              description: z.string().describe("Definition Description"),
              status: z.enum(["active", "inactive"]).describe("Definition Status"),
              createdAt: z.string().nullish().describe("Definition Created At"),
            })
            .passthrough()
        ),
        pagination: z.object({
          total: z.number().describe("Total count of definitions"),
          page: z.number().describe("Current page number"),
          size: z.number().describe("Number of items per page"),
        }),
      }),
    })
  )
  .handler(async ({ input }) => {
    const list = await db.query.definition.findMany({
      offset: (input.page - 1) * input.limit,
      limit: input.limit,
      where: and(eq(definitionTable.status, "active"), eq(definitionTable.type, "definition")),
      orderBy: desc(definitionTable.createdAt),
      columns: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
      },
    });

    const totalCount = await db
      .select({
        count: count(),
      })
      .from(definitionTable)
      .where(and(eq(definitionTable.status, "active"), eq(definitionTable.type, "definition")));

    return {
      message: "Definition listed successfully",
      data: {
        list,
        pagination: {
          total: totalCount?.at(0)?.count ?? 0,
          page: input.page,
          size: input.limit,
        },
      },
    };
  });
