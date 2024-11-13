import { Modal } from "react-native-paper";

type ErrorModalProps = {
  visible: boolean;
  onClick: () => void;
  header: string;
  subheader: string;
  transactionId: string;
};

// Note: Modal always needs to be wrapped in Portal component at the top level
export const ErrorModal = ({
  visible,
  onClick,
  header,
  subheader,
  transactionId,
}: ErrorModalProps) => {
  return (
    <Modal visible={visible} contentContainerStyle={{ height: "100%" }}>
      <div
        onClick={onClick}
        className="m-auto flex w-[600px] flex-col items-center gap-4 rounded-lg bg-white px-14 py-8 text-center shadow-2xl"
      >
        <img className="max-w-8" src="/media/error.png" />
        <div className="text-3xl font-extrabold text-red-500">{header}</div>
        <div className="text-lg font-semibold text-slate-600">{subheader}</div>
        <div className="mb-3 text-lg font-semibold">
          Transaction ID: {transactionId}
        </div>
        <div>Tap to return to title screen</div>
      </div>
    </Modal>
  );
};
