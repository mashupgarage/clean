import { ComponentProps } from "react";
import { NavButton } from "./NavButton";
import { useNavigate } from "react-router-dom";

type FooterProps = {
  nextLink?: string;
  onClick?: () => void;
  nextProps?: ComponentProps<"button">;
} & Omit<ComponentProps<"button">, "onClick">;

export const Footer = ({
  nextLink,
  onClick,
  nextProps,
  ...props
}: FooterProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4 flex w-full flex-row justify-between px-16 py-3 uppercase">
      <NavButton {...props} label={"Cancel"} onClick={() => navigate("/")} />
      <NavButton {...props} label={"Go back"} onClick={() => navigate(-1)} />

      {!nextLink || !onClick ? null : (
        <NavButton
          {...nextProps}
          {...props}
          label={"Next"}
          onClick={() => console.log("placeholder button")}
        />
      )}

      {nextLink && (
        <NavButton
          {...nextProps}
          {...props}
          label={"Next"}
          onClick={() => navigate(nextLink)}
        />
      )}

      {onClick && (
        <NavButton
          {...nextProps}
          {...props}
          label={"Next"}
          onClick={() => onClick()}
        />
      )}
    </div>
  );
};
