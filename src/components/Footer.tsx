import { ComponentProps } from "react";
import { NavButton } from "./NavButton";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

type FooterProps = {
  nextLink?: string;
  onClick?: () => void;
  nextProps?: ComponentProps<"button">;
  cancelButton?: boolean;
  containerStyles?: string;
} & Omit<ComponentProps<"button">, "onClick">;

export const Footer = ({
  nextLink,
  onClick,
  nextProps,
  cancelButton = false,
  containerStyles,
  ...props
}: FooterProps) => {
  const navigate = useNavigate();

  return (
    <div className={`flex flex-col items-center ${containerStyles}`}>
      <div className="mb-4 flex w-[full] flex-row gap-16 py-3">
        <NavButton {...props} label={"Go back"} onClick={() => navigate(-1)} />

        {!nextLink || !onClick ? null : (
          <NavButton
            {...nextProps}
            {...props}
            theme="dark"
            label={"Next"}
            onClick={() => console.log("placeholder button")}
          />
        )}

        {nextLink && (
          <NavButton
            {...nextProps}
            {...props}
            theme="dark"
            label={"Next"}
            onClick={() => navigate(nextLink)}
          />
        )}

        {onClick && (
          <NavButton
            {...nextProps}
            {...props}
            theme="dark"
            label={"Next"}
            onClick={() => onClick()}
          />
        )}
      </div>

      {cancelButton && (
        <Link
          className="mt-5 rounded-full border-4 border-gray-400 px-24 py-3 text-3xl font-extrabold text-gray-400"
          to="/"
        >
          Cancel
        </Link>
      )}
    </div>
  );
};
