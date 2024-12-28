import { Calendar } from "lucide-react";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {
  addHistory,
  addItem,
  calculateTotals,
  removeItem,
  setCustomer,
  setDate,
  setDueDate,
  setInvoiceNumber,
  setReference,
  updateItem,
} from "../redux/slices/invoiceSlice";

import {
  accountOptions,
  calculateGrandTotal,
  calculateItemAmount,
  calculateSubtotal,
  calculateTotalTax,
  displayValue,
  incrementInvoiceNumber,
  taxOptions,
} from "../utils";

const InvoiceForm = () => {
  const [startDate, setStartDate] = useState(null);

  const dispatch = useDispatch();
  const [taxMode, setTaxMode] = useState("exclusive"); // i have set defacult exclusive
  const [rawDateUpdated, setRawDateUpdated] = useState(false);
  console.log("rawdateupdated",rawDateUpdated)
  const {
    items,
    total,
    date,
    dueDate,
    invoiceNumber,
    reference,
    customer,
    history,
  } = useSelector((state) => state.invoice);

  const handleAddItem = () => {
    dispatch(
      addItem({
        item: "",
        description: "",
        qty: "",
        unitPrice: "",
        disc: "",
        taxRate: 0,
        account: "",
      })
    );
    dispatch(calculateTotals());
  };

  const handleUpdateItem = (index, field, value) => {
    const processedValue = ["qty", "unitPrice", "disc"].includes(field)
      ? value === ""
        ? ""
        : Number(value)
      : value;

    const updatedItem = {
      ...items[index],
      [field]: processedValue,
    };
    dispatch(updateItem({ index, item: updatedItem }));
    dispatch(calculateTotals());
  };

  const handleRemoveItem = (index) => {
    dispatch(removeItem(index));
    dispatch(calculateTotals());
  };

  const handleSave = () => {
    toast.success("Data saved successfully!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  
    const updatedItems = items.map((item) => ({
      ...item,
      total: calculateItemAmount(item, taxMode),
    }));
  
    const itemDetails = updatedItems
      .map((item) => `${item.item || "Item"} (${item.account || "No Account"})`)
      .join(", ");
  
    const grandTotal = calculateGrandTotal(updatedItems, taxMode); // Calculate grand total once
    const newHistory = {
      date: new Date(date).toLocaleDateString(),
      dueDate: new Date(dueDate).toLocaleDateString(),
      total: grandTotal,
      action: `Invoice ${invoiceNumber} created for ${customer}. Amount: ₹${grandTotal}. Items: ${itemDetails} And Due Date is: ${dueDate}${
        reference ? ` Reference By : ${reference}` : ""
      }`,
    };
  
    dispatch(addHistory(newHistory));
    const nextInvoiceNumber = incrementInvoiceNumber(invoiceNumber);
    dispatch(setInvoiceNumber(nextInvoiceNumber));
  };
  const handleRawChange = (e) => {
    if (!e || !e.target || !e.target.value) return;
    const inputvalue = e.target.value.trim();

    const regex = /^\+?(\d+)\+?$/;
    const match = inputvalue.match(regex);
    if (match) {
      const daysToAdd = parseInt(match[1], 10);

      const newDate = new Date();
      

      newDate.setDate(newDate.getDate() + daysToAdd);
      dispatch(setDueDate(newDate.toISOString()));
      // e.preventDefault(); // Prevent DatePicker's default behavior
      // e.stopPropagation();
    }
  };

  const handleTaxModeChange = (mode) => {
    console.log("handletaxmodechange",mode)
    setTaxMode(mode);
    dispatch(calculateTotals());
  };

  return (
    <>
      <ToastContainer></ToastContainer>
      <div className="bg-white min-h-screen p-6 ">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-8">
            {/* Customer & Currency Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">To</label>
                <select
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  value={customer}
                  onChange={(e) => dispatch(setCustomer(e.target.value))}
                >
                  <option>Walk-in Customer</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Currency
                </label>
                <select className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500">
                  <option>RUPEE</option>
                </select>
              </div>
            </div>

            {/* Dates Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Date
                </label>
                <div className="relative">
                  <DatePicker
                    selected={new Date(date)}
                    onChange={(date) => {
                      setStartDate(date);
                      dispatch(setDate(date.toISOString()));
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    dateFormat="dd MMM yyyy"
                    placeholderText="Hello"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Due Date
                </label>
                <div className="relative">
                  <DatePicker
                  
                  onDayMouseEnter={()=>setRawDateUpdated(false)}
                   selected={new Date(dueDate)}
                   
                    onChange={(date) => {
                      setDueDate(date);
                      
                      if (date && !rawDateUpdated) {
                        dispatch(setDueDate(date.toISOString()));
                      }
                    }}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                    dateFormat="dd MMM yyyy"
                    onChangeRaw={(e) => {
                      handleRawChange(e);
                      setRawDateUpdated(true);
                    }}
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Invoice Details Section */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Invoice #
                </label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => dispatch(setInvoiceNumber(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1.5 block">
                  Reference
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => dispatch(setReference(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  placeholder="Enter reference"
                />
              </div>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Amounts are</span>
              <select
                className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-blue-500"
                value={
                  taxMode === "exclusive"
                    ? "Tax Exclusive"
                    : taxMode === "inclusive"
                    ? "Tax Inclusive"
                    : "No Tax"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  handleTaxModeChange(
                    value === "Tax Exclusive"
                      ? "exclusive"
                      : value === "Tax Inclusive"
                      ? "inclusive"
                      : "no-tax"
                  );
                }}
              >
                <option>Tax Exclusive</option>
                <option>Tax Inclusive</option>
                <option>No Tax</option>
              </select>
            </div>
          </div>

          {/* Table Section */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 w-8">
                    #
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Item
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Qty
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Unit Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Disc %
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Account
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
                    Tax Rate
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">
                    Amount RUPEE
                  </th>
                  <th className="w-8"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-4 text-gray-500">::</td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) =>
                          handleUpdateItem(index, "item", e.target.value)
                        }
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          handleUpdateItem(index, "description", e.target.value)
                        }
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        value={displayValue(item.qty)}
                        onChange={(e) =>
                          handleUpdateItem(index, "qty", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        value={displayValue(item.unitPrice)}
                        onChange={(e) =>
                          handleUpdateItem(index, "unitPrice", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <input
                        type="number"
                        value={displayValue(item.disc)}
                        onChange={(e) =>
                          handleUpdateItem(index, "disc", e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e" || e.key === "E") {
                            e.preventDefault();
                          }
                        }}
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1"
                      />
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={item.account || ""}
                        onChange={(e) =>
                          handleUpdateItem(index, "account", e.target.value)
                        }
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1 bg-transparent"
                      >
                        <option value="">Select Account</option>
                        {accountOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4">
                      <select
                        value={item.taxRate || 0}
                        onChange={(e) =>
                          handleUpdateItem(index, "taxRate", +e.target.value)
                        }
                        className="w-full border-0 focus:outline-none focus:ring-0 p-1 bg-transparent"
                      >
                        {taxOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-2 px-4 text-right">
                      {calculateItemAmount(item, taxMode)}
                    </td>
                    <td className="py-2 px-4">
                      <button
                        onClick={() => handleRemoveItem(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4">
              <button
                onClick={handleAddItem}
                className="inline-flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
              >
                + Add a new line
              </button>
            </div>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end mb-8">
            <div className="w-72">
              <div className="flex justify-between py-2 text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{calculateSubtotal(items, taxMode).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-sm border-b border-gray-200">
                <span className="text-gray-600">Tax</span>
                <span>{calculateTotalTax(items, taxMode).toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-3 text-lg font-medium">
                <span>Total</span>
                <span>{calculateGrandTotal(items, taxMode)}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Approve
            </button>
          </div>

          {/* History Section */}
          {history.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-600 mb-4">
                History & Notes
              </h3>
              <div className="space-y-2">
                {history.map((entry, index) => (
                  <div key={index} className="text-sm text-gray-500">
                    On {new Date(entry.date).toLocaleString()}: {entry.action}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceForm;
