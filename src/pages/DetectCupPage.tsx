import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { Item } from "../components/Item";
import CountdownTimer from "../components/CountdownTimer";

const DETECT_CUP_HEADER = {
  line1: "Please hold your cup under the tap",
  line2: "請將杯放在感應掣上",
};

export const DetectCupPage: React.FC = () => {
  const { item, size } = useParams();
  console.log(
    `SELECTED ITEM: ${item?.toUpperCase()} SELECTED SIZE: ${size?.toUpperCase()}`,
  );

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DETECT_CUP_HEADER} />

      <div className="flex h-full flex-col items-center justify-center">
        {item === "a" ? (
          <Item
            imageUrl="http://localhost:5173/media/dispenser/image/Tap-A-place-cup.png"
            link={`/${item}/size/${size}/dispense`}
          />
        ) : (
          <Item
            imageUrl="http://localhost:5173/media/dispenser/image/Tap-B-place-cup.png"
            link={`/${item}/size/${size}/dispense`}
          />
        )}
        <CountdownTimer />
      </div>

      <Footer disabled />
    </div>
  );
};
