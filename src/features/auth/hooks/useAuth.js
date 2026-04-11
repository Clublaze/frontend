import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { clearAuth, setAuthLoading, setCredentials } from '@store/authSlice';
import { normalizeAuthUser } from '@auth/utils/normalizeAuthUser';
import api from '@services/axios';

export function useAuth() {
  const dispatch = useDispatch();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    async function initAuth() {
      dispatch(setAuthLoading(true));

      try {
        const refreshResponse = await api.post('/api/auth/refresh');
        const accessToken = refreshResponse.data.data.accessToken;
        const meResponse = await api.get('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const user = normalizeAuthUser(meResponse.data.data);

        dispatch(
          setCredentials({
            accessToken,
            user,
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
