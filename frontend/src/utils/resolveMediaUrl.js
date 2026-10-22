const API_BASE_URL = (process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/uploads/')) {
    return `${API_BASE_URL}${value}`;
  }
  return value;
};
