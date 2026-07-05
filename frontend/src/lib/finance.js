export const EXPENSE_CATEGORIES = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Entertainment",
  "Health",
  "Education",
  "Other",
];

export const INCOME_CATEGORIES = [
  "Salary",
  "Freelance",
  "Investment",
  "Other",
];

export const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export const formatCompactCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Number(value || 0));

export const formatDate = (value) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));

export const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";
