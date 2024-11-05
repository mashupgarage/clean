import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { ActivityIndicator, Modal, Portal } from "react-native-paper";
import { useState } from "react";
import { PaymentItem } from "../components/PaymentItem";

const PAYMENT_HEADER = {
  title: "Please choose payment method",
};

const OPTION_A = {
  imageUrl:
    "https://images.squarespace-cdn.com/content/v1/52ccee75e4b00bc0dba03f46/1549025413897-WU6OP5YI319QMHUP5UI8/image-asset.png",
};

const OPTION_B = {
  imageUrl:
    "https://i0.wp.com/technode.com/wp-content/uploads/2018/09/alipay-logo-cover.jpg?fit=1600%2C920&ssl=1",
};

const OPTION_C = {
  imageUrl: "/media/octopus.png",
};

const OPTION_D = {
  imageUrl: "/media/paywave.png",
};

export const PaymentPage: React.FC = () => {
  const { item, size } = useParams();
  const [visible, setVisible] = useState(false);
  const [loadingVisible, setLoadingVisible] = useState(false);
  const [option, setOption] = useState<string>("");
  const navigate = useNavigate();

  const showPaymentModal = () => {
    setLoadingVisible(true);
    setTimeout(() => {
      setLoadingVisible(false);
      setVisible(true);
    }, 2000);

    setTimeout(() => {
      setVisible(false);
      navigate(`/${item}/size/${size}/detect-cup`);
    }, 4000);
  };

  return (
    <div className="grid h-screen w-screen grid-rows-[15%,65%,20%]">
      <Portal>
        <Modal
          visible={loadingVisible}
          onDismiss={() => setLoadingVisible(false)}
          dismissable={false}
          contentContainerStyle={{ height: "100%" }}
        >
          <ActivityIndicator animating={loadingVisible} size={"large"} />
        </Modal>
        <Modal
          visible={visible}
          onDismiss={() => setVisible(false)}
          dismissable={false}
          contentContainerStyle={{ height: "100%" }}
        >
          <div className="m-auto rounded-xl bg-white px-20 py-10 text-3xl font-semibold text-blue-500">
            Payment Successful!
          </div>
        </Modal>
      </Portal>

      <Header {...PAYMENT_HEADER} />

      <div className="mx-10 my-auto flex flex-row flex-wrap items-center justify-center gap-x-20 gap-y-10">
        <PaymentItem
          {...OPTION_A}
          stateSelection={option}
          setStateSelection={setOption}
          selection="a"
        />
        <PaymentItem
          {...OPTION_B}
          stateSelection={option}
          setStateSelection={setOption}
          selection="b"
        />
        <PaymentItem
          {...OPTION_C}
          stateSelection={option}
          setStateSelection={setOption}
          selection="c"
        />
        <PaymentItem
          {...OPTION_D}
          stateSelection={option}
          setStateSelection={setOption}
          selection="d"
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
