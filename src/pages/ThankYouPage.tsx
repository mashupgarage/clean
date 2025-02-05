import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkCupPresence, fetchMenuItems } from "../api/dispenser";
import { Portal } from "react-native-paper";
import { WarningModal } from "../components/WarningModal";
import { VendingMachineAppearance } from "../types/vendingMachineAppearance";
import { Background } from "../components/Background";
import { useQuery } from "@tanstack/react-query";

export const ThankYouPage = ({
  appearanceData,
}: {
  appearanceData: VendingMachineAppearance;
}) => {
  const navigate = useNavigate();
  const { item, size } = useParams();
  const [visibleWarning, setVisibleWarning] = useState<boolean>(false);
  const {
    thank_you_background_image,
    thank_you_title,
    thank_you_subtitle,
    thank_you_text_color,
    thank_you_font_style,
    thank_you_exit_timeout,
  } = appearanceData;
  const thankYouExitTimeout = thank_you_exit_timeout * 1000;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null); // Use ref to store the timeout ID
  const { data } = useQuery({
    queryKey: ["menuItems"],
    queryFn: fetchMenuItems,
  });

  useEffect(() => {
    // Start 30 second timer, then check for cup presence
    timer.current = setTimeout(() => {
      const interval = setInterval(() => {
        if (!item) return;

        // Detect for cup presence in 1 second intervals
        checkCupPresence(item).then((data) => {
          // Show warning modal if cup is detected
          if (data?.cup_status === 2 && visibleWarning === false) {
            setVisibleWarning(true);
          }

          // Redirect after 30 seconds of not detecting
          if (data?.cup_status === 0) {
            clearInterval(interval);
            navigate("/");
          }
        });
        return () => clearInterval(interval);
      }, 1000);

      return () => {
        if (timer.current) {
          clearTimeout(timer.current);
        }
      };
    }, thankYouExitTimeout);
  }, []);

  const handleClearTimeout = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null; // Reset the ref
    }
  };

  const dispenser = data?.find((dispenser) => dispenser.name === item);
  if (!dispenser) {
    return;
  }
  const drink = dispenser.drink_name;
  const price =
    size === "Small" ? dispenser.price_small : dispenser.price_large;

  const date = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);

  return (
    <div className="h-screen w-screen">
      <Portal>
        <WarningModal
          visible={visibleWarning}
          header="Warning: Please remove cup"
          subheader="To make a new order, please remove the cup from the tap."
        />
      </Portal>
      <Background
        {...{
          backgroundMedia: thank_you_background_image,
          backgroundColor: "#FFFFFF",
        }}
      />
      <div
        className="absolute inset-0 flex flex-row items-center justify-center text-center"
        onClick={() => {
          handleClearTimeout();
          navigate("/");
        }}
      >
        <div className="w-1/2 rounded-lg bg-transparent p-12 opacity-95">
          <h1
            className="text-8xl font-extrabold"
            style={{
              fontFamily: thank_you_font_style,
              color: thank_you_text_color,
            }}
          >
            {thank_you_title}
          </h1>
          <p
            className="mt-8 text-3xl font-bold"
            style={{
              fontFamily: thank_you_font_style,
              color: thank_you_text_color,
            }}
          >
            {thank_you_subtitle}
          </p>
        </div>

        <div className="w-[480px] border border-black bg-white p-12 text-left text-sm leading-normal text-black">
          <div className="mb-4 text-2xl font-bold">Digital Receipt</div>

          <div>Date: {formattedDate}</div>
          <div>Time: {formattedTime}</div>
          <div>Store Name: Clean Taps</div>
          <div>Location: Hong Kong</div>

          <div className="mt-4 text-lg">Items Purchased:</div>
          <div className="mb-4 mt-1 flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div>Product</div>
              <div className="text-xl font-bold">{drink}</div>
            </div>
            <div className="flex flex-row gap-8">
              <div className="flex flex-col gap-2">
                <div>Unit</div>
                <div className="text-xl font-bold">1</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Price</div>
                <div className="text-xl font-bold">HK${price}</div>
              </div>
            </div>
          </div>

          <div>Subtotal: HK${price}</div>
          {/* HK does not seem to have sales tax*/}
          {/* <div>Tax (5%): HK${price} </div> */}
          <div>Total Amount: HK${price}</div>
          {/* Add payment method later */}
          <div>Payment Method: None</div>
          <div>Transaction ID: 987654321</div>
          <div>Thank you for shopping with us!</div>
          <div>Follow us on IG @cleantaps_ | www.youareclean.com</div>
        </div>
      </div>
    </div>
  );
};
