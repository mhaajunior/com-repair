import classNames from "classnames";

const InputWrap = ({
  label,
  isValid,
  required = false,
  children,
}: {
  label: string;
  isValid: boolean;
  required?: boolean;
  children: React.ReactNode;
}) => {
  const classes = classNames("sm:flex py-5 px-8 items-center", {
    error: !isValid,
  });

  return (
    <div className={classes}>
      <div className="pr-7 font-medium sm:w-40 w-full label">
        {label.toUpperCase()}
        {required && <span className="text-red-500">*</span>}
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default InputWrap;
