interface TMovie {
  id: string
  title: string
  description: string
  thumbnail: string
  is_favorite: boolean
  is_booked: boolean
  date_booked?: string | null
  date_favorite?: string | null
}