"use client";

import "@/styles/Input.css";

const Input = ({
  placeholder,
  name,
  textarea = false,
  ...rest
}: {
  placeholder: string;
  name: string;
  textarea?: boolean;
  [rest: string]: any;
}) => {
  return (
    <>
      {!textarea && (
        <input
          type={rest.type}
          className={`input ${rest.className}`}
          placeholder={`${placeholder}`}
          autoComplete="off"
          {...rest.register(name)}
        />
      )}
      {textarea && (
        <textarea
          className={`input ${rest.className}`}
          placeholder={`${placeholder}`}
          rows="4"
          {...rest.register(name)}
        />
      )}
    </>
  );
};

export default Input;
