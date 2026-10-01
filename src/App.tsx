import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { routerBasename } from "./basename.ts";
import { ToastProvider } from "./components/Toast.tsx";
import { MockPage } from "./pages/MockPage.tsx";
import { PortalPage } from "./pages/PortalPage.tsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename={routerBasename}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<PortalPage />} />
          <Route path="/mocks/:slug" element={<MockPage />} />
          <Route path="*" element={<MockPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
