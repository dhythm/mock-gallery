import { BrowserRouter, Route, Routes } from "react-router-dom";
import { routerBasename } from "./basename.ts";
import { ToastProvider } from "./components/Toast.tsx";
import { MockPage } from "./pages/MockPage.tsx";
import { PortalPage } from "./pages/PortalPage.tsx";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter basename={routerBasename}>
        <Routes>
          <Route path="/" element={<PortalPage />} />
          <Route path="/mocks/:slug" element={<MockPage />} />
          <Route path="*" element={<MockPage />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
