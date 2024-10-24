import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import CountdownTimer from "../components/CountdownTimer";

const DETECT_CUP_HEADER = {
  line1: "Please hold your cup under the tap",
  line2: "請將杯放在感應掣上",
};

export const DetectCupPage: React.FC = () => {
  const { item, size } = useParams();
  const navigate = useNavigate();

  console.log(
    `SELECTED ITEM: ${item?.toUpperCase()} SELECTED SIZE: ${size?.toUpperCase()}`,
  );

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DETECT_CUP_HEADER} />

      <div className="flex h-full flex-col items-center justify-center">
        {item === "a" ? (
          <div
            className="relative m-10 flex h-4/5 rounded-3xl"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img
              src="http://localhost:5173/media/dispenser/image/Tap-A-place-cup.png"
              className="size-full rounded-3xl object-contain"
            />
          </div>
        ) : (
          <div
            className="relative m-10 flex h-4/5 rounded-3xl"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img
              src="http://localhost:5173/media/dispenser/image/Tap-B-place-cup.png"
              className="size-full rounded-3xl object-contain"
            />
          </div>
        )}
        <CountdownTimer />
      </div>

      <Footer disabled />
    </div>
  );
};
