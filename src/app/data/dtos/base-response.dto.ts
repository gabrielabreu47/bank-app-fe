export interface BaseResponseDto<T> {
  code: number
  message: string
  result: T
  succeed: boolean
}
