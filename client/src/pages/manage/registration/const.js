export const FIELD_MAPPING = [
  { id: "registrationId", label: "Mã hộ", minWidth: 20, align: "center" },
  { id: "address", label: "Địa chỉ", minWidth: 100, align: "left" },
  { id: "numberOfResidents", label: "Số nhân khẩu", minWidth: 30, align: "center" },
  { id: "action", label: "Thao tác", minWidth: 70, align: "center" },
];

export const INIT_ERRORS_VALUES = {
  [FIELD_MAPPING[1].id]: false,
};
