import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getRegistrationID } from "../../../redux/apiRequest";

const RegistrationDetails = () => {
  const user = useSelector(state => state.auth.login?.currentUser);
  const registration = useSelector(state => state.registration.registrations.registrationDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.token) {
      const accessToken = user.token;
      getRegistrationID(accessToken, dispatch, user.registrationId); // You may need to provide the correct ID here
    }
  }, [user, dispatch]);

  return (
    <div>
      <h2>Registration Details</h2>
      <p>Address: {registration.address}</p>
      <h3>Residents:</h3>
      <ul>
        {registration.residents.map(resident => (
          <li key={resident.id}>
            <strong>Name:</strong> {resident.name}
            <br />
            <strong>Age:</strong> {resident.age}
            <br />
            <strong>Phone Number:</strong> {resident.phoneNumber}
            <br />
            <strong>Relationship:</strong> {resident.relationship}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RegistrationDetails;
