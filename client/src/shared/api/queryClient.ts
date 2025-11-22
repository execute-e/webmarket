import { QueryClient } from '@tanstack/react-query';

export interface IProductDto {
  id: string;
  name: string;
  webpSrc: string | null;
  fallbackSrc: string | null;
  salePercent: number | null;
  price: number;
  isInStock: boolean;
  isLiked: boolean;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 1000,
    },
  },
});
