// Small, pure helper functions. No React imports here.

export const formatCurrency = (value, currency = 'USD') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(value);

export const formatDate = (date) =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(date));

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const cn = (...classes) => classes.filter(Boolean).join(' ');
