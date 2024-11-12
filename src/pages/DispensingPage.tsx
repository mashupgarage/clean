import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  checkCupPresence,
  setPump,
  startDrinkDispensing,
  stopDrinkDispensing,
} from "../api/dispenser";
import { Header } from "../components/Header";
import { CountdownTimer } from "../components/CountdownTimer";
import { ProgressBar } from "../components/ProgressBar";
import { Portal } from "react-native-paper";
import { WarningModal } from "../components/WarningModal";
import { ErrorModal } from "../components/ErrorModal";

const DISPENSING_HEADER = {
  title: "Please do not remove the cup until pouring is complete",
};

export const DispensingPage = () => {
  const navigate = useNavigate();
  const { item, size } = useParams();
  const [dispenseTime, setDispenseTime] = useState<number>();
  const [visibleWarning, setVisibleWarning] = useState<boolean>(false);
  const [visibleError, setVisibleError] = useState<boolean>(false);
  const [isDispensing, setIsDispensing] = useState<boolean>();

  useEffect(() => {
    if (!item || !size) return; // Todo: add error catching

    // On page load, set initial dispense time based on drink size
    startDrinkDispensing(item, size).then((data) => {
      console.log(size, "drink dispensing for", data?.dispense_time, "seconds");
      setDispenseTime(data?.dispense_time);

      // Update state to start detecting cup
      setIsDispensing(true);
    });
  }, []);

  // When isDispensing state is updated, start checking for cup presence
  useEffect(() => {
    if (!item || !size || !dispenseTime || !isDispensing) return;

    // Start timer to navigate to thank you page when dispense done
    const timer = setTimeout(() => {
      // Stop dispensing when dispense time has been consumed
      console.log("Dispensing completed");
      clearInterval(interval);
      navigate(`/thank-you`);

      return () => clearTimeout(timer);
    }, dispenseTime * 1000);

    // Get start time
    const startTime = new Date().getTime();

    // Start detecting for cup presence in 1 second intervals
    const interval = setInterval(() => {
      if (!item || !dispenseTime) console.log("no item or dispense time");

      console.log("checking for cup presence started");
      checkCupPresence(item).then((data) => {
        // If cup is missing: stop dispensing, record remaining time, trigger countdown
        if (data?.cup_status === 0) {
          clearInterval(interval);
          clearTimeout(timer);

          // Stop tap from dispensing
          stopDrinkDispensing(item);
          setVisibleWarning(true);

          // Get time elapsed in seconds rounded down
          const timeElapsed = Math.ceil(
            (new Date().getTime() - startTime) / 1000,
          );

          // Stop dispensing when cup removed and less than 1 second remaining
          if (dispenseTime - timeElapsed < 1) {
            console.log("Dispensing completed early");
            return navigate(`/thank-you`);
          }

          console.log("dispensing stopped after", timeElapsed, "seconds");
          console.log(dispenseTime - timeElapsed, "seconds remaining");

          // Reduce duration of subsequent dispenses
          setDispenseTime(dispenseTime - timeElapsed);
          setIsDispensing(false);

          // Start 15 second countdown to detect cup
          return startRetryCountdown(item);
        }
      });

      return () => clearInterval(interval);
    }, 1000);
  }, [isDispensing]);

  const startRetryCountdown = (item: string) => {
    if (!item || !dispenseTime) return; // Todo: add error catching
    const timer = setTimeout(() => {
      // Show error modal after 15 seconds of not detecting cup
      // TODO: Check later if needed to have a timeout to return to home page
      setVisibleWarning(false);
      setVisibleError(true);

      return () => clearTimeout(timer);
    }, 15000);

    // Try to detect cup every second for 15 seconds
    const interval = setInterval(() => {
      checkCupPresence(item).then((data) => {
        if (data?.cup_status === 2) {
          console.log("Cup detected again, attempting to dispense...");
          clearTimeout(timer);
          clearInterval(interval);
          setVisibleWarning(false);

          setPump(item, dispenseTime).then((data) => {
            // If first attempt fails, retry dispensing once
            if (data.status !== "success") {
              console.log("First attempt failed, retrying...");

              setPump(item, dispenseTime).then((data) => {
                if (data.status !== "success") {
                  console.log("Retry attempt failed.");

                  setVisibleError(true);
                }
                if (data.status === "success") {
                  console.log("Dispensing re-started");
                  clearTimeout(timer);
                  setIsDispensing(true);
                }
              });
            }

            if (data.status === "success") {
              console.log("Dispensing re-started");
              clearTimeout(timer);
              // Update state to start detecting cup
              setIsDispensing(true);
            }
          });
        }
      });

      return () => clearInterval(interval);
    }, 1000);
  };

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Portal>
        <WarningModal
          visible={visibleWarning}
          header="Warning: Cup has been removed"
          subheader="Your order has not been completed. To continue, please place your cup under the tap within 15 seconds."
          duration={15}
        />
        <ErrorModal
          visible={visibleError}
          onClick={() => navigate("/")}
          header="Error: Cup has been removed"
          subheader="Your order could not be completed. Please contact a staff member for assistance."
          transactionId="987654321"
        />
      </Portal>

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
            <img
              src="/media/pour.png"
              className="size-full -scale-x-100 object-contain"
            />
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!dispenseTime && !isDispensing && (
            <>
              <div className="mx-5 h-6 w-[650px] overflow-hidden rounded-xl bg-slate-200" />
              <div className="text-center text-4xl font-bold text-slate-600">
                Standby
              </div>
            </>
          )}

          {dispenseTime && isDispensing && (
            <>
              <ProgressBar duration={dispenseTime} />
              <CountdownTimer duration={dispenseTime} />
            </>
          )}
          {dispenseTime && !isDispensing && (
            <div className="text-center text-4xl font-bold text-slate-600">
              Please place your cup under the tap
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
