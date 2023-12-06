export const FIELD_MAPPING = [
  { id: "registrationId", label: "Mã hộ nộp", minWidth: 30, align: "center" },
  { id: "feeId", label: "ID khoản phí", minWidth: 20, align: "center" },
  { id: "amount", label: "Số tiền nộp", minWidth: 80, align: "center" },
  { id: "date", label: "Ngày nộp", minWidth: 70, align: "center" },
  { id: "action", label: "Thao tác", minWidth: 70, align: "center" },
];

export const INIT_ERRORS_VALUES = {
  [FIELD_MAPPING[0].id]: false,
  [FIELD_MAPPING[1].id]: false,
  [FIELD_MAPPING[2].id]: false,
  [FIELD_MAPPING[3].id]: false,
};
