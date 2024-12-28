import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  total: 0,
  date: new Date().toISOString(),
  dueDate: new Date().toISOString(),
  invoiceNumber: 'INV-001',
  reference: '',
  customer: 'Walk-in Customer',
  history: [],
  taxmode:"exclusive"
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push({
        item: "",
        description: "",
        qty: 1,
        unitPrice: 0,
        disc: 0,
        taxRate: 0,
        ...action.payload,
      });
    },
    removeItem: (state, action) => {
      state.items.splice(action.payload, 1);
    },
    updateItem: (state, action) => {
      const { index, item } = action.payload;
      if (index >= 0 && index < state.items.length) {
        state.items[index] = item;
      }
    },
    calculateTotals: (state) => {
      state.subtotal = state.items.reduce((sum, item) => {
        if (!item || typeof item.qty === 'undefined' || typeof item.unitPrice === 'undefined') {
          return sum;
        }
        const itemTotal = item.qty * item.unitPrice * (1 - (item.disc || 0) / 100);
        return sum + itemTotal;
      }, 0);
      console.log("state.SUBTOTAL",state.subtotal)
      
      state.tax = state.items.reduce((sum, item) => {
        if (!item || typeof item.qty === 'undefined' || typeof item.unitPrice === 'undefined') {
          return sum;
        }
        const itemTotal = item.qty * item.unitPrice * (1 - (item.disc || 0) / 100);
        return sum + (itemTotal * (item.taxRate || 0) / 100);
      }, 0);
      
      state.total = state.subtotal + state.tax;
    },
    setDate: (state, action) => {
      state.date = action.payload;
    },
    setDueDate: (state, action) => {
      console.log("STATE.DUEDATE",state.dueDate)
      state.dueDate = action.payload;
    },
    setInvoiceNumber: (state, action) => {
      state.invoiceNumber = action.payload;
    },
    setReference: (state, action) => {
      state.reference = action.payload;
    },
    setCustomer: (state, action) => {
      state.customer = action.payload;
    },
    addHistory: (state, action) => {
      state.history.push(action.payload);
    },
    resetForm: (state) => {
      return {
        ...initialState,
        invoiceNumber: `INV-${String(parseInt(state.invoiceNumber.split('-')[1]) + 1).padStart(3, '0')}`,
        date: new Date().toISOString(),
        dueDate: new Date().toISOString(),
      };
    }
  },
});

export const {
  addItem,
  removeItem,
  updateItem,
  calculateTotals,
  setDate,
  setDueDate,
  setInvoiceNumber,
  setReference,
  setCustomer,
  addHistory,
  resetForm
} = invoiceSlice.actions;

export default invoiceSlice.reducer;