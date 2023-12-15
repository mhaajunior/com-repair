import classNames from "classnames";

const InputWrap = ({
  label,
  isValid,
  required = false,
  children,
  alignStart,
  ...rest
}: {
  label: string;
  isValid: boolean;
  required?: boolean;
  children: React.ReactNode;
  alignStart?: boolean;
  [rest: string]: any;
}) => {
  const classes = classNames(
    `${rest.className} sm:flex py-5 sm:px-8 px-4 items-center`,
    {
      "!items-start": alignStart,
      error: !isValid,
    }
  );

  return (
    <div className={classes}>
      <div
        className={`${
          alignStart ? "pt-2" : ""
        } pr-7 font-medium sm:w-40 w-full label`}
      >
        {label.toUpperCase()}
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default InputWrap;
