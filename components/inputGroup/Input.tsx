import "@/styles/Input.css";
import ErrorMessage from "../ErrorMessage";

const Input = ({
  placeholder,
  name,
  textarea = false,
  errors,
  ...rest
}: {
  placeholder: string;
  name: string;
  textarea?: boolean;
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
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Input;
