import { Dispatch, SetStateAction } from "react";

type ItemProps = {
  label1?: string;
  label2?: string;
  imageUrl: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
};

export const Item = ({
  label1,
  label2,
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
}: ItemProps) => {
  return (
    <div
      className={`relative m-10 flex h-4/5 rounded-3xl ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-amber-800" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img src={imageUrl} className={`size-full rounded-3xl object-contain`} />
      <div className="absolute inset-x-0 top-10 flex justify-center text-3xl font-bold uppercase">
        {label1}
      </div>
      <div className="absolute inset-x-0 top-24 flex justify-center text-3xl font-bold uppercase">
        {label2}
      </div>
    </div>
  );
};
