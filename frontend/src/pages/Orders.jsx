
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { api, money } from "../api";
import Status from "../components/Status";

export default function OrdersPage({
  orders,
  patients,
  query,
  setQuery,
  onDone,
  notify,
  user
}) {
  const [showForm, setShowForm] = useState(false);
  const [paymentId, setPaymentId] = useState(null);
  const [resultId, setResultId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    patientId: "",
    testName: "",
    priority: "NORMAL",
    price: ""
  });

  const [amount, setAmount] = useState("");

  const [result, setResult] = useState({
    resultText: "",
    performedBy: user
  });

  async function createOrder(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api("/orders", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          patientId: Number(form.patientId),
          price: Number(form.price)
        })
      });

      setShowForm(false);

      setForm({
        patientId: "",
        testName: "",
        priority: "NORMAL",
        price: ""
      });

      notify("Test order created successfully.");
      await onDone();
    } catch (error) {
      notify(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function recordPayment(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api(`/orders/${paymentId}/payment`, {
        method: "PATCH",
        body: JSON.stringify({
          amount: Number(amount)
        })
      });

      setPaymentId(null);
      setAmount("");

      notify("Payment recorded successfully.");
      await onDone();
    } catch (error) {
      notify(error.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveResult(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api(`/orders/${resultId}/result`, {
        method: "PATCH",
        body: JSON.stringify(result)
      });

      setResultId(null);

      notify("Laboratory result saved successfully.");
      await onDone();
    } catch (error) {
      notify(error.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel page-panel">
      <div className="toolbar">
        <div>
          <h3>Laboratory Test Orders</h3>
          <p>Manage test requests, payments and results.</p>
        </div>

        <button
          className="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={17} />
          New Test Order
        </button>
      </div>

      <div className="searchbox">
        <Search size={17} />

        <input
          placeholder="Search order, patient or test..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="form-card" onSubmit={createOrder}>
          <h3>Create Laboratory Order</h3>

          <div className="form-grid">
            <label>
              Select Patient *
              <select
                required
                value={form.patientId}
                onChange={e =>
                  setForm({ ...form, patientId: e.target.value })
                }
              >
                <option value="">Choose patient</option>

                {patients.map(patient => (
                  <option value={patient.id} key={patient.id}>
                    {patient.patientNumber} - {patient.fullName}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Test Name *
              <input
                required
                value={form.testName}
                onChange={e =>
                  setForm({ ...form, testName: e.target.value })
                }
                placeholder="e.g. Full Blood Count"
              />
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={e =>
                  setForm({ ...form, priority: e.target.value })
                }
              >
                <option value="NORMAL">Normal</option>
                <option value="URGENT">Urgent</option>
              </select>
            </label>

            <label>
              Test Price (TZS) *
              <input
                type="number"
                min="0"
                required
                value={form.price}
                onChange={e =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>

            <button
              className="primary"
              disabled={saving || patients.length === 0}
            >
              {saving ? "Saving..." : "Create Order"}
            </button>
          </div>
        </form>
      )}

      {paymentId && (
        <form className="inline-form" onSubmit={recordPayment}>
          <b>Record Payment</b>

          <input
            type="number"
            min="1"
            required
            placeholder="Amount in TZS"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />

          <button className="primary" disabled={saving}>
            Save Payment
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => setPaymentId(null)}
          >
            Cancel
          </button>
        </form>
      )}

      {resultId && (
        <form className="form-card" onSubmit={saveResult}>
          <h3>Enter Test Result</h3>

          <label>
            Result / Observation
            <textarea
              required
              rows="4"
              value={result.resultText}
              onChange={e =>
                setResult({ ...result, resultText: e.target.value })
              }
            />
          </label>

          <label>
            Performed By
            <input
              value={result.performedBy}
              onChange={e =>
                setResult({ ...result, performedBy: e.target.value })
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary"
              onClick={() => setResultId(null)}
            >
              Cancel
            </button>

            <button className="primary" disabled={saving}>
              Save Result
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ORDER</th>
              <th>PATIENT / TEST</th>
              <th>TEST STATUS</th>
              <th>PRICE</th>
              <th>PAID</th>
              <th>BALANCE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {orders.length > 0 ? orders.map(order => (
              <tr key={order.id}>
                <td className="mono">
                  {order.orderNumber || order.id}
                </td>

                <td>
                  <b>{order.patient?.fullName || "Unknown patient"}</b>
                  <small>{order.testName}</small>
                </td>

                <td><Status value={order.status} /></td>

                <td className="amount">{money(order.price)}</td>

                <td>{money(order.amountPaid)}</td>

                <td>{money(order.balance)}</td>

                <td>
                  <div className="action-stack">
                    <button
                      className="mini"
                      disabled={Number(order.balance || 0) <= 0}
                      onClick={() => {
                        setPaymentId(order.id);
                        setResultId(null);
                      }}
                    >
                      Payment
                    </button>

                    <button
                      className="mini"
                      onClick={() => {
                        setResultId(order.id);
                        setPaymentId(null);
                        setResult({
                          resultText: order.resultText || "",
                          performedBy: user
                        });
                      }}
                    >
                      Result
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="7" className="empty">
                  No laboratory orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
