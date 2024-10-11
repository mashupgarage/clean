import { ComponentProps } from "react";

type NavButtonProps = ComponentProps<"button"> & {
  label: string;
  onClick: () => void;
};

export const NavButton = ({ label, onClick, ...props }: NavButtonProps) => {
  return (
    <button
      className="rounded-full bg-stone-800 px-16 py-6 text-5xl font-semibold uppercase tracking-wide text-stone-100 transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200"
      onClick={onClick}
      {...props}
    >
      <div className="m-auto uppercase text-white">{label}</div>
    </button>
  );
};
