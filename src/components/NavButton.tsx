import { ComponentProps } from "react";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";

type NavButtonProps = ComponentProps<"button"> & {
  label: string;
  onClick: () => void;
  theme?: "light" | "dark";
  appearanceData: VendingMachineAppearance;
};

export const NavButton = ({
  label,
  onClick,
  theme,
  ...props
}: NavButtonProps) => {
  const { general_button_font_style } = props.appearanceData;

  return (
    <button
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`${theme === "dark" ? "bg-black text-white" : ""} w-[650px] rounded-full py-6 text-3xl font-bold tracking-wide text-slate-600 shadow-item transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-200`}
      style={{ fontFamily: general_button_font_style }}
      onClick={onClick}
      {...props}
    >
      {label}
    </button>
  );
};
