import { RelationshipConstant } from "../../../const";

// convert DATE to DD-MM-YYYY
export const handleFormatDate = inputDate => {
  const date = new Date(inputDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

// convert DD-MM-YYYY to DATE
export const handleConvertDateFormat = inputDate => {
  if (!inputDate) return;
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
    return formattedDate;
  }
};

export const handleFilterRelationship = (registrationIdInput, genderInput, yearInput, flattenedResident) => {
  let allRegistrationId = [];

  for (var i = 0; i < flattenedResident.length; i++) {
    var currentId = flattenedResident[i].registrationId;

    if (allRegistrationId.indexOf(currentId) === -1) {
      allRegistrationId.push(currentId);
    }
  }

  if (!allRegistrationId.includes(parseInt(registrationIdInput))) {
    return ["Chủ hộ"];
  }

  let headYear = null;
  let headGender = null;
  let existedRelationship = [];

  for (let i = 0; i < flattenedResident.length; i++) {
    if (flattenedResident[i].relationship === "Chủ hộ") {
      headYear = new Date(flattenedResident[i].dob);
      headGender = flattenedResident[i].gender;
    }
    existedRelationship.push(flattenedResident[i].relationship);
  }

  const filteredRelationship = RelationshipConstant.RELATIONSHIP.filter(relationship => {
    if (
      (yearInput < headYear && relationship.isOlder === false) ||
      (yearInput > headYear && relationship.isOlder === true)
    ) {
      return false;
    }

    if (
      (genderInput === RelationshipConstant.GENDER.MALE &&
        relationship.gender === RelationshipConstant.GENDER.FEMALE) ||
      (genderInput === RelationshipConstant.GENDER.FEMALE && relationship.gender === RelationshipConstant.GENDER.MALE)
    ) {
      return false;
    }

    if (existedRelationship.includes(relationship.role) && relationship.isUnique) {
      return false;
    }

    if (relationship.isHead === false) {
      if (
        (headGender === RelationshipConstant.GENDER.FEMALE &&
          relationship.gender === RelationshipConstant.GENDER.FEMALE) ||
        (headGender === RelationshipConstant.GENDER.MALE && relationship.gender === RelationshipConstant.GENDER.MALE)
      ) {
        return false;
      }
    }

    return true;
  });

  return filteredRelationship.map(item => item.role);
};
