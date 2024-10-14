import { Link } from "react-router-dom";

type ItemProps = {
  label1: string;
  label2: string;
  imageUrl: string;
  link: string;
};

export const Item = ({ label1, label2, imageUrl, link }: ItemProps) => {
  return (
    <Link
      to={link}
      className="relative m-10 flex h-4/5 justify-center text-3xl font-bold text-black"
    >
      <img src={imageUrl} className="size-full rounded-3xl" />
      <div className="absolute inset-x-0 bottom-0 top-10 flex justify-center">
        {label1}
      </div>
      <div className="absolute inset-x-0 bottom-0 top-24 flex justify-center">
        {label2}
      </div>
    </Link>
  );
};
