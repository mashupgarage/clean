import { Header } from "../components/Header";
import { Item } from "../components/Item";
import { Footer } from "../components/Footer";

// TAP_A and TAP_B values can be later configured
const ITEM_SELECTION_HEADER = {
  line1: "Please choose your drink",
  line2: "請選擇飲品",
};

const TAP_A = {
  label1: "Coffee A",
  label2: "咖啡 A",
  imageUrl: "https://placehold.co/600x600",
};

const TAP_B = {
  label1: "Coffee B",
  label2: "咖啡 B",
  imageUrl: "https://placehold.co/600x600",
};

export const ItemSelectionPage: React.FC = () => {
  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...ITEM_SELECTION_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item {...TAP_A} link="/size/a" />
        <Item {...TAP_B} link="/size/b" />
      </div>

      <Footer />
    </div>
  );
};
