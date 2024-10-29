import { useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Item } from "../components/Item";

// TAP_A and TAP_B values can be later configured
const ITEM_SELECTION_HEADER = {
  line1: "Please choose your drink",
  line2: "請選擇飲品",
};

const TAP_A = {
  name: "Coffee A",
  price: "HK$ 2.20",
  description:
    "Indulge in a warm embrace of rich flavors with our cappuccino. This delightful beverage features a perfect balance of robust espresso, velvety steamed milk, and a cloud-like layer of frothy foam",
  imageUrl: "https://placehold.co/600x350",
};

const TAP_B = {
  name: "Coffee B",
  price: "HK$ 2.20",
  description:
    "Indulge in a warm embrace of rich flavors with our cappuccino. This delightful beverage features a perfect balance of robust espresso, velvety steamed milk, and a cloud-like layer of frothy foam",
  imageUrl: "https://placehold.co/600x350",
};

export const ItemSelectionPage: React.FC = () => {
  const [item, setItem] = useState<string>("");

  return (
    <div className="grid h-screen w-screen grid-rows-[15%,65%,20%]">
      <Header {...ITEM_SELECTION_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item
          {...TAP_A}
          stateSelection={item}
          setStateSelection={setItem}
          selection="a"
        />
        <Item
          {...TAP_B}
          stateSelection={item}
          setStateSelection={setItem}
          selection="b"
        />
      </div>

      <Footer nextProps={{ disabled: !item }} nextLink={`/${item}/size`} />
    </div>
  );
};
