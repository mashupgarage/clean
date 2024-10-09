import { ComponentProps } from "react";
import { Link } from "react-router-dom";

// TAP_A and TAP_B values can be later configured
const TAP_A = {
  labelEn: "Coffee A",
  labelCn: "咖啡 A",
  imageUrl: "https://placehold.co/600x600",
};

const TAP_B = {
  labelEn: "Coffee B",
  labelCn: "咖啡 B",
  imageUrl: "https://placehold.co/600x600",
};

type DrinkItemProps = {
  labelEn: string;
  labelCn: string;
  imageUrl: string;
  link: string;
};

export const DrinkSelectionPage: React.FC = () => {
  const Title = ({ label }: { label: string }) => {
    return (
      <div className="px-4 py-2 bg-black rounded-3xl m-auto font-bold text-5xl">
        <div className="uppercase m-auto text-white">{label}</div>
      </div>
    );
  };

  const Button = ({
    label,
    ...props
  }: ComponentProps<"button"> & {
    label: string;
  }) => {
    return (
      <button
        className="rounded-full bg-stone-800 font-semibold uppercase tracking-wide text-stone-100 transition-colors duration-300 focus:outline-none focus:ring focus:ring-stone-300 focus:ring-offset-2 text-5xl px-16 py-6 disabled:bg-gray-400 disabled:text-gray-200 disabled:cursor-not-allowed"
        {...props}
      >
        <div className="uppercase m-auto text-white">{label}</div>
      </button>
    );
  };

  const DrinkItem = ({ labelEn, labelCn, imageUrl, link }: DrinkItemProps) => {
    return (
      <Link to={link} className="relative text-black font-bold text-3xl">
        <img src={imageUrl} className="rounded-3xl block w-[600px] h-[600px]" />
        <div className="absolute top-10 left-0 right-0 bottom-0 flex justify-center">
          {labelEn}
        </div>
        <div className="absolute top-24 left-0 right-0 bottom-0 flex justify-center">
          {labelCn}
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col py-10">
      <div className="flex flex-col gap-5">
        <Title label={"Please choose your drink"} />
        <Title label={"請選擇飲品"} />
      </div>

      <div className="flex flex-row gap-10 mx-auto my-10">
        <DrinkItem
          labelEn={TAP_A.labelEn}
          labelCn={TAP_A.labelCn}
          imageUrl={TAP_A.imageUrl}
          link="/size/a" // TODO: decide url
        />
        <DrinkItem
          labelEn={TAP_B.labelEn}
          labelCn={TAP_B.labelCn}
          imageUrl={TAP_B.imageUrl}
          link="/size/b"
        />
      </div>

      <div className="flex flex-row justify-between mx-10">
        <Button disabled label={"Cancel    取消"} />
        <Button disabled label={"Go back    返回"} />
      </div>
    </div>
  );
};
