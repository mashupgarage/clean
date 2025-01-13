import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { startDrinkDispensing } from "../api/dispenser";
import { Header } from "../components/Header";
import CountdownTimer from "../components/CountdownTimer";

const DISPENSING_HEADER = {
  title: "Please do not remove the cup until pouring is complete",
};

export const DispensingPage: React.FC = () => {
  const navigate = useNavigate();
  const { item, size } = useParams();

  useEffect(() => {
    if (!item || !size) return;

    startDrinkDispensing(item, size).then((data) => {
      console.log(data);
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
        <CountdownTimer />
      </div>

      {/* TODO: Replace placeholder progress bar */}
      {/* <div className="w-full rounded-3xl bg-black px-4 py-2 text-center text-5xl font-bold uppercase leading-tight text-slate-100">
          0%
        </div> */}
      {/* </div> */}
    </div>
  );
};
