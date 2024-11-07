import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startDrinkDispensing } from "../api/dispenser";
import { Header } from "../components/Header";
import { CountdownTimer } from "../components/CountdownTimer";
import { ProgressBar } from "../components/ProgressBar";

const DISPENSING_HEADER = {
  title: "Please do not remove the cup until pouring is complete",
};

export const DispensingPage = () => {
  const navigate = useNavigate();
  const { item, size } = useParams();
  const [dispenseTime, setDispenseTime] = useState<number>(10);

  useEffect(() => {
    if (!item || !size) return;

    startDrinkDispensing(item, size).then((data) => {
      setDispenseTime(data?.dispense_time);
    });
  }, [item]);

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DISPENSING_HEADER} />

      <div className="flex h-full flex-col items-center">
        {item === "Tap-A" ? (
          <div
            className="relative m-10 mb-20 flex w-[650px]"
            onClick={() => navigate(`/thank-you`)}
          >
            <img src="/media/pour.png" className="size-full object-contain" />
          </div>
        ) : (
          <div
            className="relative m-10 mb-20 flex w-[650px]"
            onClick={() => navigate(`/thank-you`)}
          >
            <img src="/media/pour.png" className="size-full -scale-x-100" />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <ProgressBar duration={dispenseTime} />
          <CountdownTimer duration={dispenseTime} />
        </div>
      </div>
    </div>
  );
};
