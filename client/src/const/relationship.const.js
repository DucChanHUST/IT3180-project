export const GENDER = {
  MALE: "Nam",
  FEMALE: "Nữ",
};

export const RELATIONSHIP = [
  { role: "Chủ hộ", isUnique: true, isHead: true },
  { role: "Chồng", gender: GENDER.MALE, isUnique: true, isHead: false },
  { role: "Vợ", gender: GENDER.FEMALE, isUnique: true, isHead: false },
  { role: "Cha đẻ", gender: GENDER.MALE, isUnique: true, isOlder: true },
  { role: "Mẹ đẻ", gender: GENDER.FEMALE, isUnique: true, isOlder: true },
  { role: "Cha nuôi", gender: GENDER.MALE, isUnique: true, isOlder: true },
  { role: "Mẹ nuôi", gender: GENDER.FEMALE, isUnique: true, isOlder: true },
  { role: "Con đẻ", isOlder: false },
  { role: "Con nuôi", isOlder: false },
  { role: "Ông nội", gender: GENDER.MALE, isUnique: true, isOlder: true },
  { role: "Bà nội", gender: GENDER.FEMALE, isUnique: true, isOlder: true },
  { role: "Ông ngoại", gender: GENDER.MALE, isUnique: true, isOlder: true },
  { role: "Bà ngoại", gender: GENDER.FEMALE, isUnique: true, isOlder: true },
  { role: "Anh ruột", gender: GENDER.MALE, isOlder: true },
  { role: "Chị ruột", gender: GENDER.FEMALE, isOlder: true },
  { role: "Em ruột", isOlder: false },
  { role: "Cháu ruột" },
  { role: "Cụ nội", isOlder: true },
  { role: "Cụ ngoại", isOlder: true },
  { role: "Bác ruột", isOlder: true },
  { role: "Chú ruột", gender: GENDER.MALE },
  { role: "Cậu ruột", gender: GENDER.MALE },
  { role: "Cô ruột", gender: GENDER.FEMALE },
  { role: "Dì ruột", gender: GENDER.FEMALE },
  { role: "Chắt ruột" },
  { role: "người giám hộ" },
  { role: "Ở nhờ" },
  { role: "Ở mượn" },
  { role: "Ở thuê" },
  { role: "Cùng ở nhờ" },
  { role: "Cùng ở thuê" },
  { role: "Cùng ở mượn" },
  { undefined }
];
