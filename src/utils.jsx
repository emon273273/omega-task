export const incrementInvoiceNumber = (currentNumber) => {
  const prefix = "INV-";
  const currentDigits = currentNumber.replace(prefix, "");
  const nextNumber = String(parseInt(currentDigits) + 1).padStart(3, "0");
  return `${prefix}${nextNumber}`;
};

export const calculateItemAmount = (item, taxMode) => {
  const qty = item.qty === "" ? 0 : Number(item.qty);
  console.log("QTY", qty);
  const unitPrice = item.unitPrice === "" ? 0 : Number(item.unitPrice);
  console.log("unitPrice", unitPrice);
  const disc = item.disc === "" ? 0 : Number(item.disc);
  console.log("disc", disc);
  const baseAmount = qty * unitPrice * (1 - disc / 100);
  console.log("baseAmount", baseAmount);

  // if (taxMode === "inclusive" && item.taxRate > 0) {
  //   // For tax-inclusive: amount includes tax, so we need to calculate pre-tax amount
  //   const taxMultiplier = 1 + item.taxRate / 100;
  //   console.log("taxMultiplier", taxMultiplier);
  //   const result = (baseAmount / taxMultiplier).toFixed(2);
  //   console.log("result", result);
  //   return result;
  // } else {
    // For tax-exclusive or no-tax: amount is pre-tax
    console.log("FROM ELSE ", baseAmount.toFixed(2));
    return baseAmount.toFixed(2);
  // }
};

export const calculateItemTaxAmount = (item, taxMode) => {
  const qty = item.qty === "" ? 0 : Number(item.qty);
  console.log("QTY", qty);
  const unitPrice = item.unitPrice === "" ? 0 : Number(item.unitPrice);
  console.log("unitPrice", unitPrice);
  const disc = item.disc === "" ? 0 : Number(item.disc);
  console.log("disc", disc);
  const baseAmount = qty * unitPrice * (1 - disc / 100);
  console.log("baseAmount", baseAmount);

  if (taxMode === "inclusive" && item.taxRate > 0) {
    // For tax-inclusive: amount includes tax, so we need to calculate pre-tax amount
    const taxMultiplier = 1 + item.taxRate / 100;
    console.log("taxMultiplier", taxMultiplier);
    const result = (baseAmount / taxMultiplier).toFixed(2);
    console.log("result", result);
    return result;
  } else {
    // For tax-exclusive or no-tax: amount is pre-tax
    console.log("FROM ELSE ", baseAmount.toFixed(2));
    return baseAmount.toFixed(2);
  }
};

export const calculateTotalTax = (items, taxMode) => {
  if (taxMode === "no-tax") return 0;
  let result = [];
  if (items) {
    result = items.reduce(
      (acc, item) => acc + calculateItemTax(item, taxMode),
      0
    );
  }
  return result;
};

export const calculateSubtotal = (items, taxMode) => {
  let result = [];
  console.log("CALLINGGGGGGGGGGGGGGGGGG SUBTOTALLLLLLLLLLLLLLLL");
  if (items) {
    result = items.reduce(
      (acc, item) => acc + parseFloat(calculateItemAmount(item, taxMode)),
      0
    );
    console.log("RESULTTTTTTTTTTTTTTTTTTTTTTTTTTT",result)
  }
  return result;
};

export const displayValue = (value) => {
  return value === "" || value === null ? "" : value.toString();
};

export const calculateGrandTotal = (items, taxMode) => {
  const subTotal = calculateSubtotal(items, taxMode);
  const totalTax = calculateTotalTax(items, taxMode);
  const result = (
    (parseFloat(subTotal) || 0) + (parseFloat(totalTax) || 0)
  ).toFixed(2);
  return result;
};

export const calculateItemTax = (item, taxMode) => {
  // const amount = parseFloat(calculateItemAmount(item, taxMode));
  const taxAmount = parseFloat(calculateItemTaxAmount(item, taxMode));
  if (taxMode === "no-tax") return 0;
  return taxAmount * (item.taxRate / 100);
};

export const accountOptions = [
  "Accounts Payable",
  "Accounts Receivable",
  "Bank",
  "Cash",
  "Cost of Sales",
  "Damage Inventory",
  "Discount Earned",
  "Discount Given",
];

export const taxOptions = [
  { label: "Tax Exempt@0%", value: 0 },
  { label: "Standard@10%", value: 10 },
  { label: "GST@15%", value: 15 },
];
