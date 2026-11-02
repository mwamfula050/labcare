
export default function Status({ value }) {
  const status = String(value || "PENDING").toUpperCase();

  let style = "neutral";

  if (["COMPLETED", "PAID"].includes(status)) {
    style = "success";
  } else if (["IN_PROGRESS", "PARTIAL"].includes(status)) {
    style = "warning";
  } else if (["CANCELLED", "REJECTED"].includes(status)) {
    style = "danger";
  }

  return (
    <span className={`status ${style}`}>
      <i />
      {status.replaceAll("_", " ")}
    </span>
  );
}
