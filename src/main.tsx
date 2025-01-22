import {
  Fragment,
  // StrictMode
} from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import MaterialCommunityIconsFont from "react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf";
import { PaperProvider } from "react-native-paper";
import { Platform } from "react-native";
import App from "./App.tsx";

// Pages
import { ErrorPage } from "./error-page.tsx";
import { ItemSelectionPage } from "./pages/ItemSelectionPage.tsx";
import { ItemSizePage } from "./pages/ItemSizePage.tsx";
import { PaymentPage } from "./pages/PaymentPage.tsx";
import { DetectCupPage } from "./pages/DetectCupPage.tsx";
import { DispensingPage } from "./pages/DispensingPage.tsx";
import { IdlePage } from "./pages/IdlePage.tsx";
import { ThankYouPage } from "./pages/ThankYouPage.tsx";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <IdlePage /> },
      { path: "item/", element: <ItemSelectionPage /> },
      { path: ":item/", element: <ItemSizePage /> },
      { path: ":item/:size/payment", element: <PaymentPage /> },
      { path: ":item/:size/detect-cup", element: <DetectCupPage /> },
      { path: ":item/:size/dispense", element: <DispensingPage /> },
      { path: ":item/:size/thank-you", element: <ThankYouPage /> },
    ],
  },
]);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Avoid refetching on focus
      staleTime: 60 * 60 * 1000, // 60 minutes stale time
    },
  },
});

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
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
  </QueryClientProvider>,
  // </StrictMode>,
);
