import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";

const DISPENSING_HEADER = {
  line1: "Please hold your cup under the tap",
  line2: "請將杯放在感應掣上",
};

// const TIME = 10; Variable timer depending on the cup size

export const DispensingPage: React.FC = () => {
  const { item, size } = useParams();
  console.log(
    `SELECTED ITEM: ${item?.toUpperCase()} SELECTED SIZE: ${size?.toUpperCase()}`,
  );

  const DISPENSING_TEXT = {
    label1: "Do not remove the cup until pouring is completed",
    label2: "在倒飲品完之前，不要取出杯子",
  };

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...DISPENSING_HEADER} />

      <div className="m-auto flex h-2/3 w-1/3 flex-col items-center justify-center gap-5">
        <div className="flex w-full flex-col gap-2 rounded-3xl bg-[rgb(130,166,125)] p-9 text-center text-5xl font-bold uppercase leading-[1.1] text-slate-100">
          <div>{DISPENSING_TEXT.label1}</div>
          <div>{DISPENSING_TEXT.label2}</div>
        </div>

        {/* TODO: Replace placeholder progress bar */}
        <div className="w-full rounded-3xl bg-black px-4 py-2 text-center text-5xl font-bold uppercase leading-tight text-slate-100">
          0%
        </div>
      </div>

      <Footer disabled />
    </div>
  );
};
