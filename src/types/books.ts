export interface BookSearchResult {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

export interface BookDetail {
  title: string
  description?: string | { value: string }
  covers?: number[]
  subjects?: string[]
}

export interface ViewedBook {
  id: string
  title: string
  author: string
  coverId: number
}
