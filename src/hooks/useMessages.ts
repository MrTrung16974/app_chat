import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi, sendMessageApi } from '@/services/api/endpoints';
import type { Message } from '@/types/models';
import { createId } from '@/utils/id';

export const useMessages = (conversationId: string, userId: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useInfiniteQuery({
    queryKey: ['messages', conversationId],
    queryFn: ({ pageParam }) => messagesApi(conversationId, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.data[0]?.createdAt,
    initialPageParam: undefined,
  });

  const sendMutation = useMutation({
    mutationFn: (body: string) => sendMessageApi(conversationId, body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });
      const optimistic: Message = {
        id: createId('tmp'),
        conversationId,
        senderId: userId,
        body,
        createdAt: new Date().toISOString(),
        status: 'sending',
      };

      queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
        if (!oldData) return oldData;
        const pages = [...oldData.pages];
        pages[pages.length - 1] = {
          ...pages[pages.length - 1],
          data: [...pages[pages.length - 1].data, optimistic],
        };
        return { ...oldData, pages };
      });

      return { optimisticId: optimistic.id };
    },
    onError: (_err, _body, context) => {
      queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
        if (!oldData) return oldData;
        const pages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: Message) =>
            msg.id === context?.optimisticId ? { ...msg, status: 'failed' } : msg,
          ),
        }));
        return { ...oldData, pages };
      });
    },
    onSuccess: (data, _body, context) => {
      queryClient.setQueryData(['messages', conversationId], (oldData: any) => {
        if (!oldData) return oldData;
        const pages = oldData.pages.map((page: any) => ({
          ...page,
          data: page.data.map((msg: Message) =>
            msg.id === context?.optimisticId ? data : msg,
          ),
        }));
        return { ...oldData, pages };
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return { messagesQuery, sendMutation };
};
