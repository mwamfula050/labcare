
import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { api } from "../api";

const initialForm = {
  fullName: "",
  dateOfBirth: "",
  sex: "",
  phone: "",
  address: "",
  referredBy: ""
};

export default function PatientsPage({
  patients,
  query,
  setQuery,
  onDone,
  notify
}) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  async function savePatient(event) {
    event.preventDefault();
    setSaving(true);

    try {
      await api("/patients", {
        method: "POST",
        body: JSON.stringify(form)
      });

      setForm(initialForm);
      setShowForm(false);

      notify("Patient registered successfully.");
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
          <h3>Patient Management</h3>
          <p>Register and manage patient information.</p>
        </div>

        <button
          className="primary"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus size={17} />
          Register Patient
        </button>
      </div>

      <div className="searchbox">
        <Search size={17} />

        <input
          placeholder="Search patients..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
      </div>

      {showForm && (
        <form className="form-card" onSubmit={savePatient}>
          <h3>New Patient Registration</h3>

          <div className="form-grid">
            <label>
              Full Name *
              <input
                required
                value={form.fullName}
                onChange={e =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
            </label>

            <label>
              Date of Birth
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={e =>
                  setForm({ ...form, dateOfBirth: e.target.value })
                }
              />
            </label>

            <label>
              Sex
              <select
                value={form.sex}
                onChange={e =>
                  setForm({ ...form, sex: e.target.value })
                }
              >
                <option value="">Select sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </label>

            <label>
              Phone Number
              <input
                value={form.phone}
                onChange={e =>
                  setForm({ ...form, phone: e.target.value })
                }
              />
            </label>

            <label>
              Address
              <input
                value={form.address}
                onChange={e =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </label>

            <label>
              Referred By
              <input
                value={form.referredBy}
                onChange={e =>
                  setForm({ ...form, referredBy: e.target.value })
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
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Patient"}
            </button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PATIENT ID</th>
              <th>FULL NAME</th>
              <th>SEX</th>
              <th>PHONE</th>
              <th>REGISTERED</th>
            </tr>
          </thead>

          <tbody>
            {patients.length > 0 ? patients.map(patient => (
              <tr key={patient.id}>
                <td className="mono">{patient.patientNumber}</td>
                <td><b>{patient.fullName}</b></td>
                <td>{patient.sex || "—"}</td>
                <td>{patient.phone || "—"}</td>
                <td>
                  {patient.registeredAt
                    ? new Date(patient.registeredAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" className="empty">
                  No patient records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
