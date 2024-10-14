import { ComponentProps } from "react";
import { NavButton } from "./NavButton";
import { useNavigate } from "react-router-dom";

export const Footer = ({
  ...props
}: Omit<ComponentProps<"button">, "onClick">) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex w-full flex-row justify-between px-16 py-3 uppercase">
      <NavButton
        {...props}
        label={"Cancel    取消"}
        onClick={() => navigate("/")}
      />
      <NavButton
        {...props}
        label={"Go back    返回"}
        onClick={() => navigate(-1)}
      />
    </div>
  );
};
