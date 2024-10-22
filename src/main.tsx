import { Fragment, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ErrorPage } from "./error-page.tsx";
import { ItemSelectionPage } from "./pages/ItemSelectionPage.tsx";
import { ItemSizePage } from "./pages/ItemSizePage.tsx";
import { PaymentPage } from "./pages/PaymentPage.tsx";
import { DetectCupPage } from "./pages/DetectCupPage.tsx";
import { DispensingPage } from "./pages/DispensingPage.tsx";
import { PaperProvider } from "react-native-paper";
import { Platform } from "react-native";
import MaterialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <ItemSelectionPage /> },
      { path: ":item/size/", element: <ItemSizePage /> },
      { path: ":item/size/:size/payment", element: <PaymentPage /> },
      { path: ":item/size/:size/detect-cup", element: <DetectCupPage /> },
      { path: ":item/size/:size/dispense", element: <DispensingPage /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PaperProvider>
      <Fragment>
        {Platform.OS === "web" ? (
          <style type="text/css">{`
        @font-face {
          font-family: 'MaterialCommunityIcons';
          src: url(${MaterialCommunityIconsFont}) format('truetype');
        }
      `}</style>
        ) : null}

        <RouterProvider router={router} />
      </Fragment>
    </PaperProvider>
  </StrictMode>,
);
