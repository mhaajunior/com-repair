import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Controller } from "react-hook-form";
import "@/styles/RangePicker.css";
import ErrorMessage from "../ErrorMessage";

const RangePicker = ({
  name,
  placeholder,
  errors,
  defaultVal,
  ...rest
}: {
  name: string;
  placeholder: string[];
  errors: any;
  defaultVal?: string[];
  [rest: string]: any;
}) => {
  const { RangePicker } = DatePicker;
  const dateFormat = "DD/MM/YYYY";

  return (
    <div className={rest.className ? rest.className : ""}>
      <Controller
        name={name}
        control={rest.control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, name, ref } }) => (
          <RangePicker
            format={dateFormat}
            defaultValue={
              defaultVal
                ? [
                    dayjs(defaultVal[0], dateFormat),
                    dayjs(defaultVal[1], dateFormat),
                  ]
                : null
            }
            onChange={onChange}
            onBlur={onBlur}
            name={name}
            ref={ref}
            className="rangepicker"
            placeholder={[placeholder[0], placeholder[1]]}
          />
        )}
      />
      <ErrorMessage>{errors?.message}</ErrorMessage>
    </div>
  );
};

export default RangePicker;
