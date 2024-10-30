import CountdownTimer from "../components/CountdownTimer";
import { Header } from "../components/Header";
import { useNavigate, useParams } from "react-router-dom";

const DISPENSING_HEADER = {
  title: "Please do not remove the cup until pouring is complete",
};

// const TIME = 10; Variable timer depending on the cup size

export const DispensingPage: React.FC = () => {
  const { item, size } = useParams();
  const navigate = useNavigate();
  console.log(
    `SELECTED ITEM: ${item?.toUpperCase()} SELECTED SIZE: ${size?.toUpperCase()}`,
  );

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DISPENSING_HEADER} />

      <div className="flex h-full flex-col items-center justify-center">
        {item === "a" ? (
          <div
            className="relative m-10 flex h-4/5 rounded-3xl"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img
              src="/media/tap.png"
              className="size-full rounded-3xl object-contain"
            />
          </div>
        ) : (
          <div
            className="relative m-10 flex h-4/5 rounded-3xl"
            onClick={() => navigate(`/${item}/size/${size}/dispense`)}
          >
            <img
              src="/media/tap.png"
              className="size-full -scale-x-100 rounded-3xl object-contain"
            />
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
