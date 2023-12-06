export const FIELD_MAPPING = [
  { id: "id", label: "ID", minWidth: 10, align: "center", isResident: true },
  { id: "nameFee", label: "Tên khoản phí", minWidth: 190, align: "left", isResident: true },
  { id: "type", label: "Loại phí", minWidth: 70, align: "center", isResident: true },
  { id: "amount", label: "Mức thu", minWidth: 80, align: "center", isResident: true },
  { id: "paid", label: "Số hộ đã nộp", minWidth: 30, align: "center", isResident: false },
  { id: "total", label: "Tổng thu", minWidth: 90, align: "center", isResident: false },
  { id: "status", label: "Trạng thái", minWidth: 80, align: "center", isResident: true },
  { id: "action", label: "Thao tác", minWidth: 60, align: "center", isResident: false },
];

export const INIT_ERRORS_VALUES = {
  nameFee: false,
  type: false,
  amount: false,
};
