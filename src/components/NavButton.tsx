import { ComponentProps } from "react";

type NavButtonProps = ComponentProps<"button"> & {
  label: string;
  onClick: () => void;
  theme?: "light" | "dark";
};

export const NavButton = ({
  label,
  onClick,
  theme,
  ...props
}: NavButtonProps) => {
  return (
    <button
      className={`${theme === "dark" ? "bg-black text-white" : ""} w-[600px] rounded-full py-6 text-4xl font-extrabold tracking-wide shadow-lg shadow-slate-400 transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200`}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};
