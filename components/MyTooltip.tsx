import React from "react";
import { Tooltip } from "antd";
import useWindowSize from "@/hooks/use-window-size";

const MyTooltip = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const size = useWindowSize();

  return size.width && size.width > 768 ? (
    <Tooltip title={title}>{children}</Tooltip>
  ) : (
    children
  );
};

export default MyTooltip;
