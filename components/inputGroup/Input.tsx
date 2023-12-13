import "@/styles/Input.css";
import ErrorMessage from "../ErrorMessage";
import { ReactNode } from "react";

const Input = ({
  placeholder,
  name,
  textarea = false,
  icon,
  onIconClick,
  errors,
  ...rest
}: {
  placeholder: string;
  name: string;
  textarea?: boolean;
  icon?: ReactNode;
  onIconClick?: () => void;
  errors: any;
  [rest: string]: any;
}) => {
  return (
    <div className={rest.className ? rest.className : ""}>
      {!textarea && (
        <input
          type={rest.type}
          className="input w-full"
          placeholder={`${placeholder}`}
          autoComplete="off"
          maxLength={rest.maxlength || 255}
          {...rest.register(name)}
        />
      )}
      {textarea && (
        <textarea
          className="input w-full"
          placeholder={`${placeholder}`}
          rows="4"
          {...rest.register(name)}
        />
      )}
      {icon && (
        <div
          className="absolute top-4 right-4 text-gray-400 cursor-pointer hover:text-black"
          onClick={onIconClick}
        >
          {icon}
        </div>
      )}
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Input;
