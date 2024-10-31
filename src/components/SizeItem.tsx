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
      className={`m-10 flex size-[600px] flex-col items-center justify-center gap-2 rounded-3xl bg-white shadow-2xl shadow-slate-400 ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img className="mb-4 w-40" src={imageUrl} />
      <div className="text-4xl font-extrabold">{name}</div>
      <div className="text-2xl font-semibold text-slate-600">{size}</div>
      <div className="text-4xl font-extrabold">{price}</div>
    </div>
  );
};
