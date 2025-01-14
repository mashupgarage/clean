import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import {
  // useEffect,
  useState,
} from "react";
import { PaymentItem } from "../components/PaymentItem";
// import { getMenuItems } from "../api/dispenser";
// import {
//   queryTransaction,
//   // // signInToKPay,
//   // startTransaction,
// } from "../api/payments";
// import { usePrivKeyStore } from "../hooks/usePrivKeyStore";

// Payment Types
// 1: Card
// 2: QR Code
// 3: QR Scan
// 4: Octopus (unavailable)
// 5: Octopus (unavailable)
// 6: Payme QR
// 7: Payme QR Scan

const PAYMENT_HEADER = {
  title: "Please choose payment method",
};

const OPTION_A = {
  imageUrl: "/media/paywave.png",
  title: "Pay with Card",
  selection: 1,
};

const OPTION_B = {
  imageUrl: "/media/qr.png",
  title: "Pay with QR Code",
  selection: 2,
};

const OPTION_C = {
  imageUrl: "/media/scan.png",
  selection: 3,
};

const OPTION_D = {
  imageUrl: "/media/PayMe-Icon-Logo.wine.svg",
  selection: 6,
};

// const formatPrice = (price: string) => {
//   // Note: Kpay requires price to be a 12 digit string padded with zeroes
//   const priceInCents = Math.round(Number(price) * 100);

//   if (
//     typeof priceInCents !== "number" ||
//     priceInCents < 0 ||
//     isNaN(priceInCents)
//   ) {
//     throw new Error("Invalid price. Must be a positive number.");
//   }

//   return priceInCents.toString().padStart(12, "0");
// };

export const PaymentPage = () => {
  const { item, size } = useParams();
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [option, setOption] = useState<number>(1); // will default to card if somehow no option selected
  // const [price, setPrice] = useState<string>("");
  const navigate = useNavigate();
  // const updatePrivKey = usePrivKeyStore((state) => state.updatePrivKey);
  // const privKey = usePrivKeyStore((state) => state.privKey);

  // useEffect(() => {
  //   if (!item || !size) return; // Todo: add error catching

  //   const fetchMenuItems = async () => {
  //     const dispensers = await getMenuItems();
  //     const dispenser = dispensers.find((dispenser) => dispenser.name === item);

  //     if (!dispenser) {
  //       return;
  //     }
  //     const price =
  //       size === "Small" ? dispenser.price_small : dispenser.price_large;

  //     setPrice(formatPrice(price));
  //   };

  //   fetchMenuItems();
  // }, []);

  const showPaymentModal = () => {
    // Start Transaction

    // Turn this into a hook that is called whenever a transaction fails
    // signInToKPay().then((data) => {
    //   const privKey = data.data.appPrivateKey;
    //   updatePrivKey(privKey);
    // });

    // startTransaction(
    //   {
    //     payAmount: price,
    //     payCurrency: "344",
    //     paymentType: option,
    //     callbackUrl:
    //       "https://clean-api.mashup.lol/api/dispenser/report-transaction/",
    //   },
    //   privKey,
    // ).then((data) => {
    // Loading animation, change to the "look at terminal" modal
    setLoadingVisible(true);

    // Start polling for data

    // if (data.)

    // if (data) {
    setTimeout(() => {
      setLoadingVisible(false);
      setSuccessVisible(true);
    }, 2000);

    setTimeout(() => {
      setSuccessVisible(false);
      navigate(`/${item}/${size}/detect-cup`);
    }, 4000);
    // }
    // });

    // queryTransaction("98765443217", privKey);
  };

  return (
    <div className="grid h-screen w-screen grid-rows-[12%,63%,25%]">
      <Portal>
        {/* Loading modal */}
        {/* Note: User needs to pay on the KPay terminal to proceed */}
        <Modal
          visible={loadingVisible}
          onDismiss={() => setLoadingVisible(false)}
          dismissable={false}
          contentContainerStyle={{ height: "100%" }}
        >
          <ActivityIndicator animating={loadingVisible} size={"large"} />
        </Modal>

        {/* Success modal */}
        <Modal
          visible={successVisible}
          onDismiss={() => setSuccessVisible(false)}
          dismissable={false}
          contentContainerStyle={{ height: "100%" }}
        >
          <div className="m-auto flex flex-col gap-4 rounded-lg bg-white px-36 py-10 text-center shadow-2xl">
            <div className="text-3xl font-extrabold text-emerald-600">
              Payment Successful
            </div>
            <div className="text-2xl font-semibold text-slate-600">
              We will be dispensing your drink shortly
            </div>
          </div>
        </Modal>

        {/* Error modal */}
        <Modal
          visible={errorVisible}
          onDismiss={() => setErrorVisible(false)}
          dismissable={false}
          contentContainerStyle={{ height: "100%" }}
        >
          <div className="m-auto flex flex-col items-center gap-4 rounded-lg bg-white px-36 py-10 text-center shadow-2xl">
            <img className="max-w-8" src="/media/error.png" />
            <div className="text-3xl font-extrabold text-red-600">
              Error: Payment Failure
            </div>
            <div className="text-2xl font-semibold text-slate-600">
              Your transaction was not successful
            </div>
            <div className="py-5 text-xl font-semibold">
              Transaction ID: 1234567890
            </div>
            <div>Tap to return to the payment options page</div>
          </div>
        </Modal>
      </Portal>

      <Header {...PAYMENT_HEADER} />

      <div className="mx-10 my-auto flex flex-row flex-wrap items-center justify-center gap-x-20 gap-y-10">
        <PaymentItem
          {...OPTION_A}
          stateSelection={option}
          setStateSelection={setOption}
        />
        <PaymentItem
          {...OPTION_B}
          stateSelection={option}
          setStateSelection={setOption}
        />
        <PaymentItem
          {...OPTION_C}
          stateSelection={option}
          setStateSelection={setOption}
          disabled
        />
        <PaymentItem
          {...OPTION_D}
          stateSelection={option}
          setStateSelection={setOption}
          disabled
        />
      </div>
      <Footer
        cancelButton={true}
        nextProps={{ disabled: !option }}
        onClick={showPaymentModal}
      />
    </div>
  );
};
