import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { SizeItem } from "../components/SizeItem";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";

const SIZE_A = {
  name: "Small",
  price: "HK$ 2.20",
  size: "354 ml (12oz)",
  imageUrl: "/media/small.png",
};

const SIZE_B = {
  name: "Large",
  price: "HK$ 3.00",
  size: "473 ml (16oz)",
  imageUrl: "/media/large.png",
};

export const ItemSizePage = ({
  appearanceData,
}: {
  appearanceData: VendingMachineAppearance;
}) => {
  const { item } = useParams();
  const [size, setSize] = useState<string>("");

  const { item_size_title, general_title_font_style } = appearanceData;

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Header title={item_size_title} fontStyle={general_title_font_style} />

      <div className="flex h-full flex-row items-center justify-center">
        <SizeItem
          imageUrl="/media/small.png" // Note: A universal image can be added to this
          name={"Small"} // Note: This needs to be added to the backend
          price={`HK$ ${Tap?.price_small}`}
          size="354 ml (12oz)" // NOTE: This needs to be added to the backend
          stateSelection={size}
          setStateSelection={setSize}
          selection="Small"
        />
        <SizeItem
          imageUrl="/media/large.png" // Note: A universal image can be added to this
          name={"Large"} // Note: This needs to be added to the backend
          price={`HK$ ${Tap?.price_large}`}
          size="473 ml (16oz)" // NOTE: This needs to be added to the backend
          stateSelection={size}
          setStateSelection={setSize}
          selection="Large"
        />
      </div>

      <Footer
        {...{appearanceData}}
        cancelButton={true}
        nextProps={{ disabled: !size }}
        nextLink={`/${item}/${size}/payment`}
      />
    </div>
  );
};
