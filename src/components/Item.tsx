import { Dispatch, SetStateAction } from "react";

type ItemProps = {
  name?: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  selection: string;
  stateSelection: string;
  setStateSelection: Dispatch<SetStateAction<string>>;
};

export const Item = ({
  name,
  price,
  description,
  imageUrl,
  selection,
  stateSelection,
  setStateSelection,
}: ItemProps) => {
  return (
    <div
      // eslint-disable-next-line tailwindcss/classnames-order
      className={`mx-8 flex h-[600px] w-[650px] flex-col rounded-3xl bg-white shadow-item ${stateSelection ? (stateSelection === selection ? "outline outline-4 outline-green-600" : "opacity-60") : ""} `}
      onClick={() => setStateSelection(selection)}
    >
      <img
        src={imageUrl}
        className={`h-[400px] w-[650px] rounded-t-3xl object-cover`}
      />
      <div className="flex flex-col gap-6 p-6">
        <div className="flex flex-row justify-between text-3xl font-extrabold">
          <div>{name}</div>
          <div>{price}</div>
        </div>
        <div>{description}</div>
      </div>
    </div>
  );
};
