import { Modal } from "react-native-paper";
import { ProgressBar } from "./ProgressBar";
import { CountdownTimer } from "./CountdownTimer";

type ErrorModalProps = {
  visible: boolean;
  onClick?: () => void;
  duration?: number;
  header: string;
  subheader: string;
};

// Note: Modal always needs to be wrapped in Portal component at the top level
export const WarningModal = ({
  visible,
  onClick,
  duration,
  header,
  subheader,
}: ErrorModalProps) => {
  return (
    <Modal visible={visible} contentContainerStyle={{ height: "100%" }}>
      <div
        onClick={onClick}
        className="m-auto flex w-[750px] flex-col items-center gap-4 rounded-lg bg-white px-14 py-8 text-center shadow-2xl"
      >
        <img className="max-w-8" src="/media/warning.png" />
        <div className="text-3xl font-extrabold text-red-500">{header}</div>
        <div className="text-lg font-semibold text-slate-600">{subheader}</div>
        {duration ? (
          <div className="flex flex-col gap-3">
            <ProgressBar duration={duration} />
            <CountdownTimer duration={duration} className="text-xl" />
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
