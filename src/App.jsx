import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/i18n";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Habits from "@/components/pages/Habits";
import Journal from "@/components/pages/Journal";
import Goals from "@/components/pages/Goals";
import Calendar from "@/components/pages/Calendar";
import ProfileSettings from "@/components/pages/ProfileSettings";
function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-background text-gray-100">
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/habits" element={<Habits />} />
<Route path="/journal" element={<Journal />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/profile" element={<ProfileSettings />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          style={{ zIndex: 9999 }}
        />
      </div>
    </I18nextProvider>
  );
}

export default App;