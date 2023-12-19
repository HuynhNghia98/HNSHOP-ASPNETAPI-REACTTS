const FormatDate = (date: Date) => {
  const formattedDate = new Date(date);
  return formattedDate.toLocaleString();
};

export default FormatDate;
