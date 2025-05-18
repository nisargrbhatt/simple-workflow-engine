import CustomEdge, { Props as CustomEdgeProps } from "./CustomEdge";
import EndTask, { Props as EndTaskProps } from "./EndTask";
import GuardTask, { Props as GuardTaskProps } from "./GuardTask";
import StartTask, { Props as StartTaskProps } from "./StartTask";

export const NodeTypes = {
  start: StartTask,
  end: EndTask,
  guard: GuardTask,
};

export const EdgeTypes = {
  custom: CustomEdge,
};

export type NodePropTypes = StartTaskProps | EndTaskProps | GuardTaskProps;
export type EdgePropTypes = CustomEdgeProps;
