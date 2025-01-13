import { Dispatch, SetStateAction } from "react";

type PaymentItemProps = {
  title?: string;
  imageUrl: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
  containerStyles?: string;
  disabled?: boolean;
};

export const PaymentItem = ({
  title,
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
  containerStyles,
  disabled,
}: PaymentItemProps) => {
  if (disabled) {
    return (
      <div
        className={`flex h-[280px] w-[650px] flex-col items-center justify-center rounded-3xl bg-gray-300 object-contain shadow-item ${containerStyles} `}
      >
        <img
          className="h-[250px] w-[600px] object-scale-down grayscale"
          src={imageUrl}
        />
        {title && (
          <div className="text-2xl font-semibold text-gray-600">{title}</div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`flex h-[280px] w-[650px] flex-col items-center justify-center rounded-3xl object-contain shadow-item ${containerStyles} ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img
        className={`${title ? "h-[220px]" : "h-[250px]"} w-[600px] object-scale-down`}
        src={imageUrl}
      />
      {title && (
        <div className="text-2xl font-semibold text-gray-800">{title}</div>
      )}
    </div>
  );
};
