import Router from "next/router";
import "tailwindcss/tailwind.css";
import "../styles/global.scss";
import withRedux from "next-redux-wrapper";
import { initStore } from "../libs/redux/store";
import NProgress from "nprogress"; //*nprogress module
import "nprogress/nprogress.css"; //*styles of nprogress
import { ToastProvider } from "react-toast-notifications";
import { SWRConfig } from "swr";

//Binding events.
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

function MyApp({ Component, pageProps }) {
  return (
    <ToastProvider>
      <SWRConfig>
        <Component {...pageProps} />
      </SWRConfig>
    </ToastProvider>
  );
}

export default withRedux(initStore)(MyApp);
