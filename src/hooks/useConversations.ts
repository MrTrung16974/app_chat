import { useQuery } from '@tanstack/react-query';
import { conversationsApi } from '@/services/api/endpoints';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => conversationsApi(1, 30),
  });
};
