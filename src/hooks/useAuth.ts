import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loginApi, meApi } from '@/services/api/endpoints';
import { useAuthStore } from '@/store/authStore';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginApi(email, password),
    onSuccess: async ({ token, user }) => {
      await login(token, user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });

  const meQuery = useQuery({
    queryKey: ['me'],
    queryFn: meApi,
    enabled: false,
  });

  return { loginMutation, meQuery, logout };
};
