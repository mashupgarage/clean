import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkCupPresence } from "../api/dispenser";
import { Header } from "../components/Header";
import CountdownTimer from "../components/CountdownTimer";

const DETECT_CUP_HEADER = {
  title: "Please place your cup under the tap",
};

export const DetectCupPage: React.FC = () => {
  const navigate = useNavigate();
  const { item, size } = useParams();

  useEffect(() => {
    // Detect for cup presence in 1 second intervals
    const interval = setInterval(() => {
      if (!item) return;

      // cup_status === 0 -> coffee cup not detected
      // cup_status === 2 -> coffee cup detected by infrarerd
      checkCupPresence(item).then((data) => {
        if (data?.cup_status === 2) {
          clearInterval(interval);
          navigate(`/${item}/size/${size}/dispense`);
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
    }, 30000);

    return () => clearInterval(interval);
  }, [item]);

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DETECT_CUP_HEADER} />

      <div className="flex h-full flex-col items-center">
        {item === "Tap-A" ? (
          <div
            className="relative m-10 flex w-[650px]"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img src="/media/tap.png" className="size-full" />
          </div>
        ) : (
          <div
            className="relative m-10 flex w-[650px]"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img src="/media/tap.png" className="size-full -scale-x-100" />
          </div>
        )}
        <CountdownTimer />
      </div>
    </div>
  );
};
