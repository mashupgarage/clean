import {
  // useEffect
  useState,
} from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Item } from "../components/Item";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";
import { useQuery } from "@tanstack/react-query";
import { fetchMenuItems } from "../api/dispenser";

export const ItemSelectionPage = ({
  appearanceData,
}: {
  appearanceData: VendingMachineAppearance;
}) => {
  const { item_selection_title, general_title_font_style } = appearanceData;
  const [item, setItem] = useState<string>("");
  const { data } = useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
  });

  // TODO: Add Skeleton loaders whenever the cache is reset, OR increase stale time and only change on refresh
  const Tap_A = data?.find((dispenser) => dispenser.name === "Tap-A");
  const Tap_B = data?.find((dispenser) => dispenser.name === "Tap-B");

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Header
        title={item_selection_title}
        fontStyle={general_title_font_style}
      />

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

      <Footer
        {...{ appearanceData }}
        nextProps={{ disabled: !item }}
        nextLink={`/${item}`}
      />
    </div>
  );
};
