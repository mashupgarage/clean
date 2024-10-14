import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useParams } from "react-router-dom";
import { Item } from "../components/Item";

const PAYMENT_HEADER = {
  line1: "Please choose payment method",
  line2: "請選擇付款方式",
};

export const PaymentPage: React.FC = () => {
  const { item, size } = useParams();
  console.log(
    `SELECTED ITEM: ${item?.toUpperCase()} SELECTED SIZE: ${size?.toUpperCase()}`,
  );

  return (
    <div className="grid h-screen w-screen grid-rows-[20%,66%,14%]">
      <Header {...PAYMENT_HEADER} />

      <div className="flex h-full flex-row items-center justify-center">
        <Item
          imageUrl="https://images.squarespace-cdn.com/content/v1/52ccee75e4b00bc0dba03f46/1549025413897-WU6OP5YI319QMHUP5UI8/image-asset.png"
          link={`/${item}/size/${size}/detect-cup`}
        />
        <Item
          imageUrl="https://i0.wp.com/technode.com/wp-content/uploads/2018/09/alipay-logo-cover.jpg?fit=1600%2C920&ssl=1"
          link={`/${item}/size/${size}/detect-cup`}
        />
      </div>

      <Footer />
    </div>
  );
};
