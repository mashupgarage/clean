import { Dispatch, SetStateAction } from "react";

type SizeItemProps = {
  name?: string;
  size?: string;
  price?: string;
  imageUrl: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
};

export const SizeItem = ({
  name,
  size,
  price,
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
}: SizeItemProps) => {
  return (
    <div
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`shadow-item m-8 flex h-[600px] w-[650px] flex-col items-center justify-center gap-2 rounded-3xl bg-white ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img className="mb-4 w-40" src={imageUrl} />
      <div className="text-4xl font-extrabold">{name}</div>
      <div className="text-2xl font-semibold text-gray-600">{size}</div>
      <div className="text-4xl font-extrabold text-gray-700">{price}</div>
    </div>
  );
};
