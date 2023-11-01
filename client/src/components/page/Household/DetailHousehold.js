import React from "react";

export default function DetailHousehold({
  match: {
    params: { id },
  },
}) {
  const [data] = useState({ title: "Item" });
  return (
    <div className="DetailHousehold">
      <div className="card">
        <h1>{data.title}</h1>
        <h3>ID: {id}</h3>
        <Link to="/">Return to List View</Link>
      </div>
    </div>
  );
}
