import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

const HomePage = lazy(() => import("./pages/HomePage"));
const CustomizeOrderPage = lazy(() => import("./pages/CustomizeOrderPage"));

export default function App() {
  return (
    <Suspense fallback={<div className="min-h-[100svh] w-full bg-slate-900" aria-hidden />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/customize" element={<CustomizeOrderPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}
