import classNames from "classnames";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import "@/styles/Button.css";

type ButtonProps = {
  children: React.ReactNode;
  primary?: boolean;
  secondary?: boolean;
  warning?: boolean;
  danger?: boolean;
  rounded?: boolean;
  loading?: boolean;
  [rest: string]: any;
};

const Button = ({
  children,
  primary,
  secondary,
  warning,
  danger,
  rounded,
  loading,
  ...rest
}: ButtonProps) => {
  const classes = classNames(
    rest.className,
    "flex ellipsis items-center px-3 py-2 btn",
    {
      "btn-grad": primary,
      "btn-blue": secondary,
      "btn-danger": danger,
      "btn-warning": warning,
      "rounded-3xl": rounded,
      "opacity-50 cursor-not-allowed": loading,
    }
  );

  return (
    <button {...rest} className={classes} disabled={loading}>
      {loading ? (
        <AiOutlineLoading3Quarters className="animate-spin text-white mx-auto" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
