import { SelectOptionType } from "@/types/inputProps";
import { Controller } from "react-hook-form";
import Select from "react-select";
import "@/styles/Dropdown.css";

const Dropdown = ({
  name,
  placeholder,
  options,
  isControl = true,
  ...rest
}: {
  name: string;
  placeholder: string;
  options: SelectOptionType[];
  isControl?: boolean;
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
    <>
      {isControl && (
        <Controller
          control={rest.control}
          name={name}
          render={({ field: { onChange, onBlur, name, ref, value } }) => (
            <Select
              options={options}
              onChange={(option: SelectOptionType | null) =>
                onChange(option?.value)
              }
              onBlur={onBlur}
              name={name}
              ref={ref}
              value={getValue(value)}
              classNamePrefix="dropdown"
              placeholder={placeholder}
              className={rest.className ? rest.className : ""}
            />
          )}
        />
      )}
      {!isControl && (
        <Select
          options={options}
          onChange={(option: SelectOptionType | null) =>
            rest.setterFn(option?.value)
          }
          name={name}
          classNamePrefix="dropdown"
          placeholder={placeholder}
          className={rest.className ? rest.className : ""}
        />
      )}
    </>
  );
};

export default Dropdown;
