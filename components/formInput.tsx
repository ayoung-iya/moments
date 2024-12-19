import { ForwardRefExoticComponent } from "react";

interface FormInputProps {
  type: string;
  name: string;
  placeholder: string;
  required: boolean;
  defaultValue: string | null;
  errorMessage?: string;
  Icon?: ForwardRefExoticComponent<any>;
}

export default function FormInput({
  type,
  name,
  placeholder,
  required,
  defaultValue,
  errorMessage,
  Icon,
}: FormInputProps) {
  return (
    <div>
      <div
        className={`mb-2 flex w-full items-center gap-2 rounded-full border px-5 py-1 ${errorMessage ? "border-red-600 focus-within:ring-red-600" : "border-stone-400 focus-within:ring-stone-400"} *:outline-none focus-within:ring-2 focus-within:ring-offset-1`}
      >
        {Icon && <Icon className="size-5 text-stone-500" />}
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          className="h-10 placeholder:text-stone-500 w-full"
          required={required}
          defaultValue={defaultValue || ""}
        />
      </div>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
}
