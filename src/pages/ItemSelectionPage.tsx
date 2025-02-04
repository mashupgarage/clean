import {
  // useEffect
  useState,
} from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Item } from "../components/Item";
// import { DispenserItem, getMenuItems } from "../api/dispenser";

// TAP_A and TAP_B values can be later configured
const ITEM_SELECTION_HEADER = {
  title: "Please choose your drink",
};

const TAP_A = {
  name: "Sesame Oat Latte (Cold)",
  price: "HK$ 2.20",
  description: "Sweet and addictive nougat-like oat drink",
  imageUrl: "/media/drink-a.png",
};

const TAP_B = {
  name: "Red Date & Ginger Tea (Hot)",
  price: "HK$ 2.20",
  description: "Warming and spicy tea, low sugar",
  imageUrl: "/media/drink-b.png",
};

export const ItemSelectionPage: React.FC = () => {
  // NOTE: Hardcode first since loading indicators are needed when pulling from BE
  // useEffect(() => {
  //   const fetchMenuItems = async () => {
  //     const dispensers = await getMenuItems();
  //     setDispensers(dispensers);
  //   };

  //   fetchMenuItems();
  // }, []);

  // const [dispensers, setDispensers] = useState<DispenserItem[]>([]);
  // const Tap_A = dispensers.find((dispenser) => dispenser.name === "Tap-A");
  // const Tap_B = dispensers.find((dispenser) => dispenser.name === "Tap-B");
  const [item, setItem] = useState<string>("");

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Header {...ITEM_SELECTION_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item
          {...TAP_A}
          // price={`HK$ ${Tap_A?.price_small}`}
          // imageUrl={Tap_A?.drink_image}
          stateSelection={item}
          setStateSelection={setItem}
          selection="Tap-A"
        />
        <Item
          {...TAP_B}
          // price={`HK$ ${Tap_B?.price_small}`}
          stateSelection={item}
          setStateSelection={setItem}
          selection="Tap-B"
        />
      </div>

      <Footer nextProps={{ disabled: !item }} nextLink={`/${item}`} />
    </div>
  );
};
