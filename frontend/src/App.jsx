import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Login";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ui/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import Chat from "./pages/Chat";
import VerifyUser from "./pages/VerifyUser";
import ResendVerification from "./pages/ResendVerification";
import ForgetPassword from "./pages/ForgetPassword";
import ResetForgetPassword from "./pages/ResetForgetPassword";
import ChannelPage from "./pages/ChannelPage";
import UserSetting from "./pages/UserSetting";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate replace to="/chat" />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/channel/:channelId" element={<ChannelPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/verification/:verify_token" element={<VerifyUser />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route
            path="/resetpassword/:reset_token"
            element={<ResetForgetPassword />}
          />
          <Route path="/profile" element={<UserSetting />} />
          <Route path="*" element={<Navigate replace to="/login" />} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 3000,
          },
          style: {
            fontSize: "16px",
            maxWidth: "500px",
            padding: "16px 24px",
            backgroundColor: "white",
            color: "gray.700",
          },
        }}
      />
    </QueryClientProvider>
  );
};

export default App;
