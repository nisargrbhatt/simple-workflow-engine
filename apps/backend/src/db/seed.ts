import { db } from '.';
import { definitionTable } from './schema';

async function seed() {
  // Add default definition templates
  await db.insert(definitionTable).values([
    {
      name: 'test',
      description: '',
      tasks: [],
      global: undefined,
      status: 'active',
      type: 'template',
      uiObject: {},
    },
  ]);
}

async function main() {
  try {
    await seed();
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
}

main();
