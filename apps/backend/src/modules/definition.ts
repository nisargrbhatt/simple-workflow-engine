import { db } from '@db/index';
import { definitionTable } from '@db/schema';
import { contractOpenSpec } from '@lib/implementor';
import { safeAsync } from '@repo/utils';
import { and, asc, count, desc, eq } from 'drizzle-orm';
import { definitionTaskList } from '@repo/engine/types';

export const createDefinition = contractOpenSpec.definition.create.handler(async ({ input, errors }) => {
  const parsedTask = definitionTaskList.safeParse(input.tasks);

  if (!parsedTask.success) {
    throw errors.BAD_REQUEST({
      message: 'Invalid task list',
    });
  }

  const createdDefinitionResult = await safeAsync(
    db
      .insert(definitionTable)
      .values({
        name: input.name,
        description: input.description,
        tasks: parsedTask.data,
        global: input.global,
        status: input.status,
        type: input.type,
        uiObject: input.uiObject,
      })
      .returning({
        id: definitionTable.id,
      })
  );

  if (!createdDefinitionResult.success) {
    console.error(createdDefinitionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Create Definition failed',
    });
  }

  const createdDefinitionId = createdDefinitionResult.data?.at(0)?.id;

  if (typeof createdDefinitionId !== 'number') {
    throw errors.BAD_REQUEST({
      message: "Can't create definition",
    });
  }

  return {
    message: 'Definition created successfully',
    data: {
      id: createdDefinitionId,
    },
  };
});

export const editDefinition = contractOpenSpec.definition.edit.handler(async ({ input, errors }) => {
  const parsedTask = definitionTaskList.safeParse(input.body.tasks);

  if (!parsedTask.success) {
    throw errors.BAD_REQUEST({
      message: 'Invalid task list',
    });
  }

  const definitionResult = await safeAsync(
    db.query.definition.findFirst({
      where: eq(definitionTable.id, Number(input.params.id)),
      columns: {
        id: true,
      },
    })
  );

  if (!definitionResult.success) {
    console.error(definitionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!definitionResult.data) {
    throw errors.NOT_FOUND({
      message: 'Definition not found',
    });
  }

  const definitionId = definitionResult.data.id;

  const createdDefinitionResult = await safeAsync(
    db
      .update(definitionTable)
      .set({
        name: input.body.name,
        description: input.body.description,
        tasks: parsedTask.data,
        global: input.body.global,
        status: input.body.status,
        type: input.body.type,
        uiObject: input.body.uiObject,
      })
      .where(eq(definitionTable.id, definitionId))
      .returning({
        id: definitionTable.id,
      })
  );

  if (!createdDefinitionResult.success) {
    console.error(createdDefinitionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Edit Definition failed',
    });
  }

  const updatedDefinitionId = createdDefinitionResult.data?.at(0)?.id;

  if (typeof updatedDefinitionId !== 'number') {
    throw errors.BAD_REQUEST({
      message: "Can't edit definition",
    });
  }

  return {
    message: 'Definition edited successfully',
    data: {
      id: updatedDefinitionId,
    },
  };
});

export const listDefinition = contractOpenSpec.definition.list.handler(async ({ input }) => {
  const list = await db.query.definition.findMany({
    offset: (input.page - 1) * input.limit,
    limit: input.limit,
    where: eq(definitionTable.type, 'definition'),
    orderBy: [asc(definitionTable.status), desc(definitionTable.createdAt)],
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
    .where(and(eq(definitionTable.status, 'active'), eq(definitionTable.type, 'definition')));

  return {
    message: 'Definition listed successfully',
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

export const fetchEditDefinition = contractOpenSpec.definition.fetchEdit.handler(async ({ input, errors }) => {
  const result = await safeAsync(
    db.query.definition.findFirst({
      where: eq(definitionTable.id, Number(input.id)),
      columns: {
        id: true,
        global: true,
        description: true,
        uiObject: true,
        name: true,
      },
    })
  );

  if (!result.success) {
    console.error(result.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!result.data) {
    throw errors.NOT_FOUND({
      message: 'Definition not found',
    });
  }

  return {
    message: 'Definition fetched successfully',
    data: result.data,
  };
});

export const deleteDefinition = contractOpenSpec.definition.delete.handler(async ({ errors, input }) => {
  const definitionResult = await safeAsync(
    db.query.definition.findFirst({
      where: eq(definitionTable.id, Number(input.id)),
      columns: {
        id: true,
      },
    })
  );

  if (!definitionResult.success) {
    console.error(definitionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!definitionResult.data) {
    throw errors.NOT_FOUND({
      message: 'Definition not found',
    });
  }

  const deleteResult = await safeAsync(
    db
      .update(definitionTable)
      .set({ status: 'inactive' })
      .where(eq(definitionTable.id, Number(input.id)))
      .returning({
        id: definitionTable.id,
      })
  );

  if (!deleteResult.success) {
    console.error(deleteResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  return {
    message: 'Definition deleted successfully',
  };
});

export const fetchDefinition = contractOpenSpec.definition.get.handler(async ({ input, errors }) => {
  const result = await safeAsync(
    db.query.definition.findFirst({
      where: eq(definitionTable.id, Number(input.id)),
      columns: {
        id: true,
        global: true,
        description: true,
        name: true,
        status: true,
        type: true,
        createdAt: true,
        tasks: true,
      },
    })
  );

  if (!result.success) {
    console.error(result.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!result.data) {
    throw errors.NOT_FOUND({
      message: 'Definition not found',
    });
  }

  return {
    message: 'Definition fetched successfully',
    data: result.data,
  };
});
