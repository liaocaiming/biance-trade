import moment from "moment";

export default (currentDate: any) => {
  return moment(currentDate) >= moment();
};
