
import { money } from "../api";
import Status from "./Status";

export default function OrderTable({ rows = [] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ORDER</th>
            <th>PATIENT</th>
            <th>TEST</th>
            <th>STATUS</th>
            <th>PAYMENT</th>
            <th>AMOUNT</th>
          </tr>
        </thead>

        <tbody>
          {rows.length > 0 ? (
            rows.map(order => (
              <tr key={order.id}>
                <td className="mono">
                  {order.orderNumber || order.id}
                </td>

                <td>
                  <b>{order.patient?.fullName || "Unknown patient"}</b>
                  <small>{order.patient?.patientNumber || ""}</small>
                </td>

                <td>{order.testName}</td>

                <td>
                  <Status value={order.status} />
                </td>

                <td>
                  <Status value={order.paymentStatus} />
                </td>

                <td className="amount">{money(order.price)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="empty">
                No laboratory orders available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
