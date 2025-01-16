import { ForwardRefExoticComponent, InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  errorMessage?: string;
  Icon?: ForwardRefExoticComponent<any>;
}

export default function Input({ name, errorMessage, Icon, ...rest }: FormInputProps) {
  return (
    <div>
      <div
        className={`mb-2 flex w-full items-center gap-2 rounded-full border bg-white px-5 py-1 ${errorMessage ? "border-red-600 focus-within:ring-red-600" : "border-stone-400 focus-within:ring-stone-400"} *:outline-none focus-within:ring-2 focus-within:ring-offset-1`}
      >
        {Icon && <Icon className="size-5 text-stone-500" />}
        <input name={name} className="h-10 w-full placeholder:text-stone-500" {...rest} />
      </div>
      {errorMessage && <p className="text-red-600">{errorMessage}</p>}
    </div>
  );
}
