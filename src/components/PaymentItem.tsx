import { Dispatch, SetStateAction } from "react";

type PaymentItemProps = {
  imageUrl: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
  containerStyles?: string;
};

export const PaymentItem = ({
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
  containerStyles,
}: PaymentItemProps) => {
  return (
    <div
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`shadow-item flex h-[280px] w-[650px] flex-col items-center justify-center rounded-3xl object-contain ${containerStyles} ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img className="h-[250px] w-[600px] object-scale-down" src={imageUrl} />
    </div>
  );
};
