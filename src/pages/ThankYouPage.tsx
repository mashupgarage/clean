import { useNavigate } from "react-router-dom";

const THANK_YOU_HEADER = {
  line1: "Your order is complete. Thank you!",
  line2: "Tap to order again",
};

export const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();

  // Automatically redirect to idle page after 10 seconds
  setTimeout(() => {
    navigate("/");
  }, 10000);

  return (
    <div className="h-screen w-screen">
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
