import { PaginatedResultDto } from '../dto/pagination.dto.js';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ResponseFormat<T> {
  success: boolean;
  data: T;
  pagination?: PaginationMeta;
  timestamp: string;
}

export function paginatedResponse<T>(
  result: PaginatedResultDto<T>,
): ResponseFormat<T[]> {
  return {
    success: true,
    data: result.data,
    pagination: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    },
    timestamp: new Date().toISOString(),
  };
}
