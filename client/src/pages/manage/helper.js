import { RelationshipConstant } from "../../const";

export const convertToVietnameseWords = number => {
  if (isNaN(number)) {
    return "Không phải là một số";
  }

  const units = ["", "nghìn", "triệu", "tỷ", "nghìn tỷ", "triệu tỷ", "tỷ tỷ"];
  const words = ["", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

  const convertGroup = num => {
    let result = "";
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;

    if (hundred > 0) {
      result += words[hundred] + " trăm ";
    }

    if (remainder > 0) {
      if (remainder < 10) {
        result += words[remainder];
      } else if (remainder < 20) {
        result += words[remainder - 10] + " mười";
      } else {
        const tens = Math.floor(remainder / 10);
        const ones = remainder % 10;

        result += words[tens] + " mươi";

        if (ones > 0) {
          result += " " + words[ones];
        }
      }
    }

    return result;
  };

  const convert = (num, unit) => {
    if (num === 0) {
      return "";
    }

    const group = convertGroup(num);
    const unitText = units[unit];

    return group + " " + unitText;
  };

  const groups = [];
  let remaining = number;

  for (let i = 0; i < units.length && remaining > 0; i++) {
    const groupValue = remaining % 1000;
    groups.push(convert(groupValue, i));
    remaining = Math.floor(remaining / 1000);
  }

  const result = groups
    .reverse()
    .filter(group => group.trim() !== "")
    .join(" ");

  return result + " đồng";
};

export const formatAmount = number => {
  if (isNaN(number)) {
    return;
  }
  const formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return formattedNumber;
};

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

export const handleFilterRelationship = (
  registrationIdInput,
  genderInput,
  yearInput,
  flattenedResident,
  currentRelationship = "",
) => {
  if (!registrationIdInput || !genderInput) return [];

  const uniqueRegistrationIdsSet = new Set(flattenedResident.map(item => item.registrationId));
  const allRegistrationId = [...uniqueRegistrationIdsSet];

  const registrationResident = flattenedResident.filter(item => item.registrationId === parseInt(registrationIdInput));

  if (!allRegistrationId.includes(parseInt(registrationIdInput))) {
    return ["Chủ hộ"];
  }

  let headYear = null;
  let headGender = null;
  let existedRelationship = [];

  for (let i = 0; i < registrationResident.length; i++) {
    if (registrationResident[i].relationship === "Chủ hộ") {
      headYear = new Date(registrationResident[i].dob);
      headGender = registrationResident[i].gender;
    }
    existedRelationship.push(registrationResident[i].relationship);
  }

  if (currentRelationship) {
    existedRelationship = existedRelationship.filter(item => item !== currentRelationship);
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
