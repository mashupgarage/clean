import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkCupPresence } from "../api/dispenser";
import { Header } from "../components/Header";
import { CountdownTimer } from "../components/CountdownTimer";
import { ProgressBar } from "../components/ProgressBar";
import { ErrorModal } from "../components/ErrorModal";
import { Portal } from "react-native-paper";
import { WarningModal } from "../components/WarningModal";

const DETECT_CUP_HEADER = {
  title: "Please place your cup under the tap",
};

export const DetectCupPage: React.FC = () => {
  const navigate = useNavigate();
  const { item, size } = useParams();
  const [visibleWarning, setVisibleWarning] = useState<boolean>(false);
  const [visibleError, setVisibleError] = useState<boolean>(false);

  useEffect(() => {
    // Detect for cup presence in 1 second intervals
    const interval = setInterval(() => {
      if (!item) return; // add error catching

      // cup_status === 0 -> cup not detected
      // cup_status === 2 -> cup detected by infrarerd
      checkCupPresence(item).then((data) => {
        if (data?.cup_status === 0) {
          console.log("No cup detected");
        }
        if (data?.cup_status === 2) {
          clearInterval(interval);
          navigate(`/${item}/size/${size}/dispense`);
        }
      });
    }, 1000);

    // Show warning modal after 30 seconds
    setTimeout(() => {
      setVisibleWarning(true);

      // Show error modal after 10 seconds
      setTimeout(() => {
        clearInterval(interval);
        setVisibleWarning(false);
        setVisibleError(true);
      }, 10000);
    }, 30000);

    return () => clearInterval(interval);
  }, [item]);

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Portal>
        <WarningModal
          visible={visibleWarning}
          header="Warning: No cup detected"
          subheader="No cup has been detected. To continue, please place your cup under the tap within 10 seconds or the order will be cancelled."
          duration={10}
        />
        <ErrorModal
          visible={visibleError}
          onClick={() => navigate("/")}
          header="Error: No cup detected"
          subheader="No cup has been detected. The order is now cancelled. Please contact a
        staff member for assistance."
          transactionId="987654321"
        />
      </Portal>
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
        <div className="flex flex-col gap-4">
          <ProgressBar duration={30} />
          <CountdownTimer duration={30} />
        </div>
      </div>
    </div>
  );
};
