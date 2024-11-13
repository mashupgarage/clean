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
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`${theme === "dark" ? "bg-black text-white" : ""} shadow-item w-[650px] rounded-full py-6 text-3xl font-bold tracking-wide text-slate-600 transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200`}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};
