import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useState } from "react";
import { Item } from "../components/Item";

// TAP_A and TAP_B values can be later configured
const ITEM_SELECTION_HEADER = {
  line1: "Please choose your drink",
  line2: "請選擇飲品",
};

const TAP_A = {
  label1: "Coffee A",
  imageUrl: "https://placehold.co/600x600",
};

const TAP_B = {
  label1: "Coffee B",
  imageUrl: "https://placehold.co/600x600",
};

export const ItemSelectionPage: React.FC = () => {
  const [item, setItem] = useState<string>("");

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
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
