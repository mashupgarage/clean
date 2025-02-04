import {
  // useEffect
  useState,
} from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Item } from "../components/Item";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";

const TAP_A = {
  name: "Coffee A",
  price: "HK$ 2.20",
  description:
    "Indulge in a warm embrace of rich flavors with our cappuccino. This delightful beverage features a perfect balance of robust espresso, velvety steamed milk, and a cloud-like layer of frothy foam",
  imageUrl: "/media/coffee-a.png",
};

const TAP_B = {
  name: "Coffee B",
  price: "HK$ 2.20",
  description:
    "Indulge in a warm embrace of rich flavors with our cappuccino. This delightful beverage features a perfect balance of robust espresso, velvety steamed milk, and a cloud-like layer of frothy foam",
  imageUrl: "/media/coffee-b.png",
};

export const ItemSelectionPage = ({
  appearanceData,
}: {
  appearanceData: VendingMachineAppearance;
}) => {
  const [item, setItem] = useState<string>("");

  const { item_selection_title, general_title_font_style } = appearanceData;

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Header title={item_selection_title} fontStyle={general_title_font_style} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item
          imageUrl={Tap_A?.drink_image}
          price={`HK$ ${Tap_A?.price_small}`}
          name={Tap_A?.drink_name}
          description={Tap_A?.drink_name2} // Note: This can be renamed to description in the backend
          stateSelection={item}
          setStateSelection={setItem}
          selection="Tap-A"
        />
        <Item
          imageUrl={Tap_B?.drink_image}
          price={`HK$ ${Tap_B?.price_small}`}
          name={Tap_B?.drink_name}
          description={Tap_B?.drink_name2}
          stateSelection={item}
          setStateSelection={setItem}
          selection="Tap-B"
        />
      </div>

      <Footer {...{appearanceData}} nextProps={{ disabled: !item }} nextLink={`/${item}`} />
    </div>
  );
};
