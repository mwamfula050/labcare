
import { useEffect, useMemo, useState } from "react";

import { api, clearCredentials } from "./api";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PatientsPage from "./pages/Patients";
import OrdersPage from "./pages/Orders";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

export default function App() {
  const [username, setUsername] = useState(
    sessionStorage.getItem("labUser") || ""
  );

  const [page, setPage] = useState("dashboard");

  const [summary, setSummary] = useState(null);
  const [patients, setPatients] = useState([]);
  const [orders, setOrders] = useState([]);

  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadData() {
    setLoading(true);

    try {
      // These endpoints are accessible to the four configured roles.
      const [patientRows, orderRows] = await Promise.all([
        api("/patients"),
        api("/orders")
      ]);

      setPatients(patientRows);
      setOrders(orderRows);

      // Dashboard summary is restricted to Manager and Cashier.
      // A 403 here must not log out Receptionist or Technician.
      try {
        const dashboardData = await api("/dashboard/summary");
        setSummary(dashboardData);
      } catch (error) {
        if (error.message.includes("permission")) {
          setSummary(null);
        } else {
          throw error;
        }
      }
    } catch (error) {
      setNotice(error.message);

      if (error.message.includes("session expired")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (username) {
      sessionStorage.setItem("labUser", username);
      loadData();
    }
  }, [username]);

  function logout() {
    clearCredentials();
    sessionStorage.removeItem("labUser");

    setUsername("");
    setSummary(null);
    setPatients([]);
    setOrders([]);
    setPage("dashboard");
  }

  const filteredPatients = useMemo(() => {
    const term = query.toLowerCase();

    return patients.filter(patient =>
      `${patient.fullName || ""} ${patient.patientNumber || ""} ${patient.phone || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [patients, query]);

  const filteredOrders = useMemo(() => {
    const term = query.toLowerCase();

    return orders.filter(order =>
      `${order.orderNumber || ""} ${order.patient?.fullName || ""} ${order.testName || ""}`
        .toLowerCase()
        .includes(term)
    );
  }, [orders, query]);

  if (!username) {
    return <Login onLogin={setUsername} />;
  }

  const titles = {
    dashboard: "Dashboard",
    patients: "Patient Management",
    orders: "Laboratory Test Orders"
  };

  return (
    <div className="shell">
      <Sidebar
        page={page}
        setPage={nextPage => {
          setPage(nextPage);
          setQuery("");
        }}
        username={username}
        onLogout={logout}
      />

      <main className="main">
        <Header
          title={titles[page]}
          username={username}
          onRefresh={loadData}
          loading={loading}
        />

        {notice && (
          <div
            className="notice"
            onClick={() => setNotice("")}
          >
            {notice}
            <b>×</b>
          </div>
        )}

        {page === "dashboard" && (
          <Dashboard
            summary={summary}
            onViewOrders={() => setPage("orders")}
          />
        )}

        {page === "patients" && (
          <PatientsPage
            patients={filteredPatients}
            query={query}
            setQuery={setQuery}
            onDone={loadData}
            notify={setNotice}
          />
        )}

        {page === "orders" && (
          <OrdersPage
            orders={filteredOrders}
            patients={patients}
            query={query}
            setQuery={setQuery}
            onDone={loadData}
            notify={setNotice}
            user={username}
          />
        )}

        <footer>
          LabCare Laboratory Management System
          <span>•</span>
          Patient information is confidential
        </footer>
      </main>
    </div>
  );
}
