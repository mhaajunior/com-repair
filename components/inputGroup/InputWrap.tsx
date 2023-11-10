import classNames from "classnames";

const InputWrap = ({
  label,
  isValid,
  children,
}: {
  label: string;
  isValid: boolean;
  children: React.ReactNode;
}) => {
  const classes = classNames("sm:flex py-5 px-8 items-center", {
    error: !isValid,
  });

  return (
    <div className={classes}>
      <div className="pr-7 font-bold w-64 label">{label.toUpperCase()}</div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default InputWrap;
