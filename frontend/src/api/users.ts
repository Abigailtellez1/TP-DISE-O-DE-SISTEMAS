import { apiRequest } from './client'
import type { ListingNotification, UserProfile, UserProfileRequest } from '../types/user'

export const fetchUserProfile = (userId: string) =>
  apiRequest<UserProfile>(`/api/users/${userId}`)

export const upsertStudentProfile = (userId: string, payload: UserProfileRequest) =>
  apiRequest<UserProfile>(`/api/users/students/${userId}`, {
    method: 'PUT',
    body: { ...payload, type: 'STUDENT' },
  })

export const upsertLandlordProfile = (userId: string, payload: UserProfileRequest) =>
  apiRequest<UserProfile>(`/api/users/landlords/${userId}`, {
    method: 'PUT',
    body: { ...payload, type: 'LANDLORD' },
  })

export const fetchUserNotifications = (userId: string) =>
  apiRequest<ListingNotification[]>(`/api/users/${userId}/notifications`)
