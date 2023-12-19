import React from "react";

const inputHelper = (
  e: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >,
  data: any
) => {
  const tempData: any = { ...data };
  if (e.target.name === "productDetailId" || e.target.name === "quantity") {
    tempData[e.target.name] = parseInt(e.target.value, 10);
  } else {
    tempData[e.target.name] = e.target.value;
  }
  return tempData;
};

export default inputHelper;
