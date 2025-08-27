import {inject} from '@angular/core';
import {BaseModel} from '../models/base.model';
import {HttpClient} from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {PaginatedResponseDto} from '../dtos/paginated-response.dto';
import {BaseResponseDto} from '../dtos/base-response.dto';

export abstract class BaseService<T extends BaseModel> {
  abstract controller: string;
  protected httpClient = inject(HttpClient);

  create(body: Omit<T, 'id'>){
    return lastValueFrom(this.httpClient.post<T>(this.controller, body))
  }

  read<T>(route?: string, params?: any){
    return lastValueFrom(this.httpClient.get<BaseResponseDto<T>>(route ? `${this.controller}/${route}` : this.controller, {
      params: params
    }))
  }

  readPaginated(pagination: {currentPage: number, pageSize: number} = {currentPage: 1, pageSize: 10}, route?: string, filters?: string){
    return lastValueFrom(this.httpClient.get<PaginatedResponseDto<T>>(route ? `${this.controller}/${route}` : this.controller, {
      params: {
        pageNumber: pagination.currentPage.toString(),
        pageSize: pagination.pageSize.toString(),
        ...(
          filters ? {filters} : {}
        )
      }
    }))
  }

  readById(id: string){
    return lastValueFrom(this.httpClient.get<BaseResponseDto<T>>(`${this.controller}/${id}`))
  }

  update(id: string,body: Partial<Omit<T, 'id'>>){
    return lastValueFrom(this.httpClient.put<T>(`${this.controller}/${id}`, body))
  }

  delete(id: string){
    return lastValueFrom(this.httpClient.delete<T>(`${this.controller}/${id}`))
  }
}
