import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { SizeItem } from "../components/SizeItem";
import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "../api/dispenser";

const ITEM_SIZE_HEADER = {
  title: "Please select the size of your drink",
};

export const ItemSizePage: React.FC = () => {
  const { item } = useParams();
  const [size, setSize] = useState<string>("");
  const { data } = useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
  });

  // const [dispensers, setDispensers] = useState<DispenserItem[]>([]);
  const Tap = data?.find((dispenser) => dispenser.name === item);

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Header {...ITEM_SIZE_HEADER} />

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
        cancelButton={true}
        nextProps={{ disabled: !size }}
        nextLink={`/${item}/${size}/payment`}
      />
    </div>
  );
};
