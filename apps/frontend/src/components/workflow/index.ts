import type { Props as CustomEdgeProps } from "./CustomEdge";
import CustomEdge from "./CustomEdge";
import type { Props as EndTaskProps } from "./EndTask";
import EndTask from "./EndTask";
import FunctionTask from "./FunctionTask";
import type { Props as FunctionTaskProps } from "./FunctionTask";
import type { Props as GuardTaskProps } from "./GuardTask";
import GuardTask from "./GuardTask";
import type { Props as StartTaskProps } from "./StartTask";
import StartTask from "./StartTask";

export const NodeTypes = {
  start: StartTask,
  end: EndTask,
  guard: GuardTask,
  function: FunctionTask,
};

export const EdgeTypes = {
  custom: CustomEdge,
};

export type NodePropTypes = StartTaskProps | EndTaskProps | GuardTaskProps | FunctionTaskProps;
export type EdgePropTypes = CustomEdgeProps;
