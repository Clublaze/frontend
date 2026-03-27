import { toast as toastify } from 'react-toastify';

export const toast = {
  success: (msg) => toastify.success(msg),
  error: (msg) => toastify.error(msg),
  info: (msg) => toastify.info(msg),
  warn: (msg) => toastify.warn(msg),
};
