"use client";

import { GroupProps } from "@/types/outputProps";
import React, { useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md";

const Panel = ({
  children,
  data,
  onEdit,
  onDelete,
}: {
  children: React.ReactNode;
  data: GroupProps;
  onEdit: (data: GroupProps) => void;
  onDelete: (data: GroupProps) => void;
}) => {
  const [showOption, setShowOption] = useState(false);
  return (
    <div
      className="border-b p-2 last:border-b-0 hover:bg-slate-50 flex justify-between items-center"
      onMouseEnter={() => setShowOption(true)}
      onMouseLeave={() => setShowOption(false)}
    >
      {children}
      {showOption && (
        <div className="flex gap-1">
          <span
            className="cursor-pointer hover:text-yellow-500 text-lg"
            onClick={() => onEdit(data)}
          >
            <MdEdit />
          </span>
          <span
            className="cursor-pointer hover:text-red-500 text-lg"
            onClick={() => onDelete(data)}
          >
            <MdDelete />
          </span>
        </div>
      )}
    </div>
  );
};

export default Panel;
