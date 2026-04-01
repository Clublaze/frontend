import { clearAuth } from '@auth/authSlice';
import { store } from '@store/store';

export function logout() {
  store.dispatch(clearAuth());
  window.location.href = '/login';
}
