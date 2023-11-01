import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Household.css";

const Household = () => {
  // Placeholder for list data
  const [data] = useState([
    { id: "24", title: "Chị Phương", address: "203", sonhankhau: "4" },
    { id: "25", title: "Chị Giang", address: "203", sonhankhau: "4" },
    { id: "26", title: "Chị Ánh", address: "203", sonhankhau: "4" },
    { id: "27", title: "Anh Đức", address: "203", sonhankhau: "4" },
  ]);
  return (
    <div className="Household">
      <div className="heading">DANH SÁCH CÁC HỘ GIA ĐÌNH</div>
      <table className="table">
        <thead>
          <tr>
            <th>id</th>
            <th>title</th>
            <th>address</th>
            <th>sonhankhau</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="list-item">
              <td>
                <Link to={item.id}>{item.id}</Link>
              </td>
              <td>{item.title}</td>
              <td>{item.address}</td>
              <td>{item.sonhankhau}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Household;