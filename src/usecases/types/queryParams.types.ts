export type EntityPagination = {
  limit: number,
  offset: number,
}

export type EntitySort<T extends string = string> = {
  sort: T,
  order: 'ASC' | 'DESC',
}
