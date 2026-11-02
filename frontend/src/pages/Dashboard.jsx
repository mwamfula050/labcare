
import {
  Users,
  FlaskConical,
  Wallet,
  AlertCircle,
  Activity
} from "lucide-react";

import { money } from "../api";
import OrderTable from "../components/OrderTable";

export default function Dashboard({ summary, onViewOrders }) {
  const cards = [
    {
      title: "Total Patients",
      value: summary?.totalPatients ?? "—",
      description: "Registered patients",
      icon: Users,
      color: "blue"
    },
    {
      title: "Tests Today",
      value: summary?.todayOrders ?? "—",
      description: "Today's test orders",
      icon: FlaskConical,
      color: "violet"
    },
    {
      title: "Revenue Today",
      value: summary ? money(summary.todayRevenue) : "—",
      description: "Today's recorded revenue",
      icon: Wallet,
      color: "green"
    },
    {
      title: "Outstanding",
      value: summary ? money(summary.outstandingBalance) : "—",
      description: "Unpaid balances",
      icon: AlertCircle,
      color: "orange"
    }
  ];

  return (
    <>
      <section className="welcome">
        <div>
          <div className="eyebrow">MANAGEMENT CONSOLE</div>

          <h1>
            Welcome to
            <br />
            <span>LabCare System.</span>
          </h1>

          <p>
            Manage patients, laboratory tests, results and payments.
          </p>
        </div>

        <div className="welcome-art">
          <Activity size={75} />
          <span>LABORATORY SYSTEM</span>
        </div>
      </section>

      {summary ? (
        <section className="stats">
          {cards.map(card => {
            const Icon = card.icon;

            return (
              <div className="stat" key={card.title}>
                <div className={`stat-icon ${card.color}`}>
                  <Icon size={19} />
                </div>

                <span>{card.title}</span>
                <strong>{card.value}</strong>
                <small>{card.description}</small>
              </div>
            );
          })}
        </section>
      ) : (
        <section className="panel">
          <h3>Welcome to your workspace</h3>
          <p>
            Your account can access its assigned laboratory functions.
            Management statistics are available to authorized Manager
            and Cashier accounts.
          </p>
        </section>
      )}

      <section className="panel">
        <div className="panel-head">
          <div>
            <h3>Recent Laboratory Orders</h3>
            <p>Latest test orders recorded in the system.</p>
          </div>

          <button className="text-btn" onClick={onViewOrders}>
            View all →
          </button>
        </div>

        <OrderTable rows={summary?.recentOrders || []} />
      </section>
    </>
  );
}
