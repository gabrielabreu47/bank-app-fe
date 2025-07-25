import {BaseResponseDto} from './base-response.dto';

interface PaginatedDto<T>{
  items: T[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
}

export interface PaginatedResponseDto<T> extends BaseResponseDto<PaginatedDto<T>> {

}
