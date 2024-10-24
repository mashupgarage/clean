import { Header } from "../components/Header";
import { Item } from "../components/Item";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";

const ITEM_SIZE_HEADER = {
  line1: "Please select the size of your drink",
  line2: "請選擇您飲品的大小",
};

const SIZE_A = {
  label1: "Small (小)",
  label2: "HK$1.00",
  imageUrl: "https://placehold.co/600x600",
};

const SIZE_B = {
  label1: "Large (大)",
  label2: "HK$1.00",
  imageUrl: "https://placehold.co/600x600",
};

export const ItemSizePage: React.FC = () => {
  const { item } = useParams();
  const [size, setSize] = useState<string>("");
  console.log(`SELECTED ITEM: ${item?.toUpperCase()}`);

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...ITEM_SIZE_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item
          {...SIZE_A}
          stateSelection={size}
          setStateSelection={setSize}
          selection="a"
        />
        <Item
          {...SIZE_B}
          stateSelection={size}
          setStateSelection={setSize}
          selection="b"
        />
      </div>

      <Footer
        nextProps={{ disabled: !size }}
        nextLink={`/${item}/size/${size}/payment`}
      />
    </div>
  );
};
