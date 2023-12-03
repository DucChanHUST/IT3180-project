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
