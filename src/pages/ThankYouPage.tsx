import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { checkCupPresence } from "../api/dispenser";
import { Portal } from "react-native-paper";
import { WarningModal } from "../components/WarningModal";

const THANK_YOU_HEADER = {
  line1: "Your order is complete. Thank you!",
  line2: "Tap to order again",
};

export const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { item } = useParams();
  const [visibleWarning, setVisibleWarning] = useState<boolean>(false);

  useEffect(() => {
    // start 15 second timer, then check for cup presence
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (!item) return;

        // Detect for cup presence in 1 second intervals
        checkCupPresence(item).then((data) => {
          // Show warning modal if cup is detected
          if (data?.cup_status === 2 && visibleWarning === false) {
            setVisibleWarning(true);
          }

          // Redirect after 15 seconds of not detecting
          if (data?.cup_status === 0) {
            clearInterval(interval);
            navigate("/");
          }
        });
        return () => clearInterval(interval);
      }, 1000);

      return () => clearTimeout(timer);
    }, 3000);
  }, []);

  return (
    <div className="h-screen w-screen">
      <Portal>
        <WarningModal
          visible={visibleWarning}
          header="Warning: Please remove cup"
          subheader="To make a new order, please remove the cup from the tap."
        />
      </Portal>
      <img
        src="http://localhost:5173/media/coffee-placeholder.png"
        className="absolute left-0 top-0 size-full object-cover"
      />
      <div
        className="absolute inset-0 flex flex-row items-center justify-center text-center text-white"
        onClick={() => navigate("/item")}
      >
        <div className="w-1/2 rounded-lg bg-transparent p-12 opacity-95">
          <h1 className="text-8xl font-extrabold">{THANK_YOU_HEADER.line1}</h1>
          <p className="mt-8 text-3xl font-bold">{THANK_YOU_HEADER.line2}</p>
        </div>

        <div className="w-[480px] bg-white p-12 text-left text-sm leading-normal text-black">
          <div className="mb-4 text-2xl font-bold">Digital Receipt</div>

          <div>Date: October 23, 2024</div>
          <div>Time: 2:15 PM</div>
          <div>Store Name: The Corner Store</div>
          <div>Location: 123 Main St, Anytown, USA</div>

          <div className="mt-4 text-lg">Items Purchased:</div>
          <div className="mb-4 mt-1 flex flex-row justify-between">
            <div className="flex flex-col gap-2">
              <div>Product</div>
              <div className="text-xl font-bold">Drink A</div>
            </div>
            <div className="flex flex-row gap-8">
              <div className="flex flex-col gap-2">
                <div>Unit</div>
                <div className="text-xl font-bold">1</div>
              </div>
              <div className="flex flex-col gap-2">
                <div>Price</div>
                <div className="text-xl font-bold">HK$ 2.00</div>
              </div>
            </div>
          </div>

          <div>Subtotal: HK$ 2.00</div>
          <div>Tax (5%): HK$0.74</div>
          <div>Total Amount: HK$ 3.12</div>
          <div>Payment Method: Credit Card (**** **** **** 1234)</div>
          <div>Transaction ID: 987654321</div>
          <div>Thank you for shopping with us!</div>
          <div>Visit us again at www.thecornerstore.com</div>
        </div>
      </div>
    </div>
  );
};
