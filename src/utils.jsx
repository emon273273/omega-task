export const incrementInvoiceNumber = (currentNumber) => {
  const prefix = "INV-";
  const currentDigits = currentNumber.replace(prefix, "");
  const nextNumber = String(parseInt(currentDigits) + 1).padStart(3, "0");
  return `${prefix}${nextNumber}`;
};

export const calculateItemAmount = (item, taxMode) => {
  const qty = item.qty === "" ? 0 : Number(item.qty);
  const unitPrice = item.unitPrice === "" ? 0 : Number(item.unitPrice);
  const disc = item.disc === "" ? 0 : Number(item.disc);
  const baseAmount = qty * unitPrice * (1 - disc / 100);

  if (taxMode === "inclusive" && item.taxRate > 0) {
   
    const taxMultiplier = 1 + (item.taxRate / 100);
    return baseAmount.toFixed(2); 
  } else {
    
    return baseAmount.toFixed(2);
  }
};

export const calculateItemTax = (item, taxMode) => {
  if (taxMode === "no-tax") return 0;

  const qty = item.qty === "" ? 0 : Number(item.qty);
  const unitPrice = item.unitPrice === "" ? 0 : Number(item.unitPrice);
  const disc = item.disc === "" ? 0 : Number(item.disc);
  const baseAmount = qty * unitPrice * (1 - disc / 100);
  const taxRate = item.taxRate / 100;

  if (taxMode === "inclusive" && item.taxRate > 0) {
    
    return (baseAmount - (baseAmount / (1 + taxRate))).toFixed(2);
  } else if (taxMode === "exclusive") {
    
    return (baseAmount * taxRate).toFixed(2);
  }
  return 0;
};

export const calculateSubtotal = (items, taxMode) => {
  if (!items) return 0;

  return items.reduce((acc, item) => {
    const amount = parseFloat(calculateItemAmount(item, taxMode));
    if (taxMode === "inclusive" && item.taxRate > 0) {
     
      const taxRate = item.taxRate / 100;
      return acc + (amount / (1 + taxRate));
    }
    return acc + amount;
  }, 0);
};

export const calculateTotalTax = (items, taxMode) => {
  if (!items || taxMode === "no-tax") return 0;

  return items.reduce((acc, item) => {
    const tax = parseFloat(calculateItemTax(item, taxMode));
    return acc + tax;
  }, 0);
};

export const calculateGrandTotal = (items, taxMode) => {
  const subTotal = calculateSubtotal(items, taxMode);
  const totalTax = calculateTotalTax(items, taxMode);
  
  if (taxMode === "inclusive") {
   
    return parseFloat(subTotal + totalTax).toFixed(2);
  } else if (taxMode === "exclusive") {
    
    return (parseFloat(subTotal) + parseFloat(totalTax)).toFixed(2);
  } else {
   
    return parseFloat(subTotal).toFixed(2);
  }
};

export const displayValue = (value) => {
  return value === "" || value === null ? "" : value.toString();
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