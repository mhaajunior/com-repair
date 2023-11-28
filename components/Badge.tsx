import React from "react";
import classNames from "classnames";

const Badge = ({
  children,
  color,
  active,
  count,
  ...rest
}: {
  children: React.ReactNode;
  color: string;
  active: boolean;
  count: number;
  [rest: string]: any;
}) => {
  const style = {
    backgroundColor: color,
  };
  const classes = classNames(
    rest.className,
    "text-center relative p-2 text-sm text-white rounded-t-xl hover:cursor-pointer hover:opacity-50 w-[80px] whitespace-nowrap overflow-hidden text-ellipsis",
    {
      "border-t-[5px] border-gray-400": active,
    }
  );

  return (
    <div className={classes} style={style} {...rest}>
      <div className="absolute right-0 top-0 p-1 bg-red-500 rounded-xl text-xs">
        {count || 0}
      </div>
      {children}
    </div>
  );
};

export default Badge;
