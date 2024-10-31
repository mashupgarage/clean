import { Dispatch, SetStateAction } from "react";

type PaymentItemProps = {
  imageUrl: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
};

export const PaymentItem = ({
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
}: PaymentItemProps) => {
  return (
    <div
      className={`flex h-[250px] w-[600px] flex-col items-center justify-center rounded-3xl bg-white object-contain shadow-2xl shadow-slate-400 ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img className="h-[250px] w-[600px] object-scale-down" src={imageUrl} />
    </div>
  );
};
