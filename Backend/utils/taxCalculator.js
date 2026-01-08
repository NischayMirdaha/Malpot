export const calculateTaxRate = (landType, district) => {
  let baseRate = 0;

  if (landType === "Residential") baseRate = 10;
  if (landType === "Agricultural") baseRate = 5;
  if (landType === "Commercial") baseRate = 20;

  // Example: Kathmandu higher rate
  if (district === "Kathmandu") {
    baseRate += 5;
  }

  return baseRate; // rate per sq meter
};