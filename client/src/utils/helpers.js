/**
 * Format price with currency symbol
 */
export const formatPrice = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable string
 */
export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (str, maxLen = 100) => {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
};

/**
 * Get error message from API response
 */
export const getErrorMessage = (error) => {
  return error.response?.data?.message || error.message || 'Something went wrong';
};
