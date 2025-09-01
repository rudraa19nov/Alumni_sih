export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'alumni' | 'student' | 'admin';
  profilePicture?: string;
  graduationYear?: number;
  course?: string;
  company?: string;
  position?: string;
  bio?: string;
  skills?: string[];
  linkedIn?: string;
  createdAt: string;
}

export interface Alumni extends User {
  role: 'alumni';
  graduationYear: number;
  course: string;
  company?: string;
  position?: string;
  achievements?: string[];
  mentorshipAvailable: boolean;
}

export interface Student extends User {
  role: 'student';
  currentYear: number;
  course: string;
  mentorshipRequested?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'networking' | 'workshop' | 'reunion' | 'webinar';
  maxAttendees?: number;
  currentAttendees: number;
  registeredUsers: string[];
  imageUrl?: string;
  organizer: string;
  createdAt: string;
}

export interface MentorshipRequest {
  id: string;
  studentId: string;
  mentorId?: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  subject: string;
  message: string;
  goals?: string;
  duration?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  id: string;
  donorId: string;
  amount: number;
  purpose: string;
  isRecurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  status: 'pending' | 'completed' | 'failed';
  donorName?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface FilterOptions {
  search?: string;
  year?: number;
  course?: string;
  company?: string;
  location?: string;
  skills?: string[];
}