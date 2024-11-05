import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { SizeItem } from "../components/SizeItem";

const ITEM_SIZE_HEADER = {
  title: "Please select the size of your drink",
};

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

export const ItemSizePage: React.FC = () => {
  const { item } = useParams();
  const [size, setSize] = useState<string>("");

  return (
    <div className="grid h-screen w-screen grid-rows-[15%,65%,20%]">
      <Header {...ITEM_SIZE_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <SizeItem
          {...SIZE_A}
          stateSelection={size}
          setStateSelection={setSize}
          selection="Small"
        />
        <SizeItem
          {...SIZE_B}
          stateSelection={size}
          setStateSelection={setSize}
          selection="Large"
        />
      </div>

      <Footer
        cancelButton={true}
        nextProps={{ disabled: !size }}
        nextLink={`/${item}/size/${size}/payment`}
      />
    </div>
  );
};
