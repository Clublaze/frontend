import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearAuth, setAuthLoading, setCredentials } from '@auth/authSlice';
import api from '@services/axios';

export function useAuth() {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;
    console.log('useAuth running');

    async function initAuth() {
      dispatch(setAuthLoading(true));

      try {
        const refreshResponse = await api.post('/auth/refresh');
        const accessToken = refreshResponse.data.data.accessToken;
        const meResponse = await api.get('/auth/me');

        dispatch(
          setCredentials({
            accessToken,
            user: meResponse.data.data,
          }),
        );
      } catch {
        dispatch(clearAuth());
      } finally {
        dispatch(setAuthLoading(false));
      }
    }

    initAuth();
  }, [dispatch]);
}
