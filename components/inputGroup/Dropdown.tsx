import { SelectOption } from "@/types/inputProps";
import { Controller } from "react-hook-form";
import Select from "react-select";
import "@/styles/Dropdown.css";
import ErrorMessage from "../ErrorMessage";

const Dropdown = ({
  name,
  placeholder,
  options,
  isControl = true,
  errors,
  ...rest
}: {
  name: string;
  placeholder: string;
  options: SelectOption[];
  isControl?: boolean;
  errors: any;
  [rest: string]: any;
}) => {
  const getValue = (value: number) => {
    if (value) {
      for (let option of options) {
        if (option.value === value) {
          return option;
        }
      }
    }

    return null;
  };

  return (
    <div className={rest.className ? rest.className : ""}>
      {isControl && (
        <Controller
          control={rest.control}
          name={name}
          render={({ field: { onChange, onBlur, name, ref, value } }) => (
            <Select
              options={options}
              onChange={(option: SelectOption | null) =>
                onChange(option?.value)
              }
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={getValue(value)}
              classNamePrefix="dropdown"
              placeholder={placeholder}
            />
          )}
        />
      )}
      {!isControl && (
        <Select
          options={options}
          onChange={(option: SelectOption | null) =>
            rest.setterFn(option?.value)
          }
          name={name}
          classNamePrefix="dropdown"
          placeholder={placeholder}
        />
      )}
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default Dropdown;
