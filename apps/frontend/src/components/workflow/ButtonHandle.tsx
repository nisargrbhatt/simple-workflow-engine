import { cn } from "@lib/utils";
import { Handle, HandleProps, Position } from "@xyflow/react";

import { FC } from "react";

const wrapperClassNames: Record<Position, string> = {
  [Position.Top]: "flex-col-reverse left-1/2 -translate-y-full -translate-x-1/2",
  [Position.Bottom]: "flex-col left-1/2 translate-y-[10px] -translate-x-1/2",
  [Position.Left]: "flex-row-reverse top-1/2 -translate-x-full -translate-y-1/2",
  [Position.Right]: "top-1/2 -translate-y-1/2 translate-x-[10px]",
};

interface Props extends HandleProps {
  showButton?: boolean;
}

export const ButtonHandle: FC<Props> = ({ showButton = true, position = Position.Bottom, children, ...props }) => {
  const wrapperClassName = wrapperClassNames[position || Position.Bottom];
  const vertical = position === Position.Top || position === Position.Bottom;

  return (
    <Handle
      position={position}
      {...props}
      className={cn(
        "dark:border-secondary dark:bg-secondary h-[11px] w-[11px] rounded-full border border-slate-300 bg-slate-100 transition",
        props.className
      )}
    >
      {showButton && (
        <div className={`absolute flex items-center ${wrapperClassName} pointer-events-none`}>
          <div className={`bg-gray-300 ${vertical ? "h-10 w-[1px]" : "h-[1px] w-10"}`} />
          <div className="nodrag nopan pointer-events-auto">{children}</div>
        </div>
      )}
    </Handle>
  );
};
