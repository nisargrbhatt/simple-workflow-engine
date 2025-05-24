export const GUARD_EXECUTION_FUNCTION_CODE = `/**
 * @returns {Promise<boolean>} Return Boolean output
 * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/guard_task}
 */
async function handler() {
  return true;
}
`;

export const FUNCTION_EXECUTION_FUNCTION_CODE = `/**
 * @see {@link https://workflow-engine-docs.pages.dev/docs/tasks/function_task}
 */
async function handler() {
  return {"hello": "world"};
}
`;
