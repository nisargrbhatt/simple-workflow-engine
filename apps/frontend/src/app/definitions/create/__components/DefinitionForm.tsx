import { EdgeTypes, NodeTypes } from "@/components/workflow";
import { useCreateDefinitionContext } from "@/contexts/CreateDefinitionContext";
import { useTheme } from "@/contexts/ThemeContext";
import type { IsValidConnection, Node, OnConnect } from "@xyflow/react";
import {
  addEdge,
  Background,
  Controls,
  getOutgoers,
  MarkerType,
  MiniMap,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import type { FC, FormEvent } from "react";
import { useCallback } from "react";
import DefinitionBasicDialog from "./DefinitionBasicDialog";
import { Button } from "@/components/ui/button";

interface Props {}

const DefinitionForm: FC<Props> = () => {
  const { edgesState, nodesState, onSubmit } = useCreateDefinitionContext();
  const { theme } = useTheme();

  const [nodes, _setNodes, onNodesChange] = nodesState;
  const [edges, setEdges, onEdgesChange] = edgesState;
  const { getNodes, getEdges } = useReactFlow();

  const onConnect: OnConnect = useCallback(
    (connection) =>
      setEdges((edges) =>
        addEdge({ ...connection, animated: true, markerEnd: { type: MarkerType.ArrowClosed }, type: "custom" }, edges)
      ),
    [setEdges]
  );

  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      if (!target) {
        return false;
      }
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) {
          return false;
        }

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) {
            return true;
          }
          if (hasCycle(outgoer, visited)) {
            return true;
          }
        }
      };

      if (target.id === connection.source) {
        return false;
      }
      return !hasCycle(target);
    },
    [getNodes, getEdges]
  );

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    onSubmit();
  };

  return (
    <form className="w-full" noValidate onSubmit={handleSubmit} id="create-definition-form">
      <div className="flex w-full flex-col items-start justify-start gap-1">
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <DefinitionBasicDialog />
          <Button type="submit" form="create-definition-form" variant={"default"}>
            Submit
          </Button>
        </div>
        <div className="h-[80vh] w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={NodeTypes}
            edgeTypes={EdgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            colorMode={theme}
            isValidConnection={isValidConnection}
          >
            <Background />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </form>
  );
};

export default DefinitionForm;
