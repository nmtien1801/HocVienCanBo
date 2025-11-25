import moment from "moment";

const TypeUserIDCons = {
  Student: 1,
  Teacher: 2,
  Administrator: 3,
};

const formatDate = (isoDate) => {
  if (isoDate && isoDate !== "0001-01-01T00:00:00") {
    return moment(isoDate).format("DD/MM/YYYY");
  }
  return "";
};

const formatToISODate = (displayDate) => {
  if (displayDate) {
    return moment(displayDate, "DD/MM/YYYY").toISOString();
  }
  return "0001-01-01T00:00:00";
};

const getGenderDisplay = (id) => {
  return id === 0 ? 'Nữ' : (id === 1 ? 'Nam' : '');
};

export { TypeUserIDCons, formatDate, formatToISODate, getGenderDisplay };