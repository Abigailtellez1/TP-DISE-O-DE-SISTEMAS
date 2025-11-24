import { apiRequest } from './client'
import { ListingNotification, UserProfile, UserProfileRequest } from '../types/user'

export const fetchUserProfile = (userId: string) =>
  apiRequest<UserProfile>(`/api/users/${userId}`)

export const upsertUserProfile = (userId: string, payload: UserProfileRequest) =>
  apiRequest<UserProfile>(`/api/users/${userId}`, {
    method: 'PUT',
    body: payload,
  })

export const fetchUserNotifications = (userId: string) =>
  apiRequest<ListingNotification[]>(`/api/users/${userId}/notifications`)
