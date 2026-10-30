import React from "react";

interface TextInputProps {
    name: string;
    placeholder: string;
    value: string;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type: string;
    title: string;
    error: string;

}
 
const TextInput = ({
  name,
  placeholder,
  value,
  handleChange,
  type,
  title,
  error,
}: TextInputProps) => {
  return (
    <>
      <div>
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-text-primary"
        >
          {title}
        </label>

        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={type}
          className={`w-full rounded-input border bg-background px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:ring-2 ${
            error
              ? "border-error/60 focus:border-error focus:ring-error/10"
              : "border-border focus:border-brand focus:ring-brand/10"
          }`}
        />

        {error && <p className="mt-2 text-xs text-error">{error}</p>}
      </div>
    </>
  );
};

export default TextInput;
