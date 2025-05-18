import { BaseEdge, Edge, EdgeLabelRenderer, type EdgeProps, getSmoothStepPath, useReactFlow } from "@xyflow/react";

import { memo, type FC } from "react";
import { Button } from "@/components/ui/button";
import { DeleteIcon } from "lucide-react";

export type Props = Edge<Record<string, unknown>, "custom">;

const CustomEdge: FC<EdgeProps<Props>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  ...props
}) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge id={id} path={edgePath} {...props} />
      <EdgeLabelRenderer>
        {selected ? (
          <div
            className="nodrag nopan pointer-events-auto absolute"
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            <Button size={"icon"} variant={"outline"} title="Delete" type="button" onClick={onEdgeClick}>
              <DeleteIcon />
            </Button>
          </div>
        ) : null}
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);
