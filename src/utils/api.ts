import { User, Alumni, Student, Event, MentorshipRequest, Donation, ApiResponse, FilterOptions } from '../types';

const API_BASE_URL = 'https://api.alumni-platform.com'; // Mock API base URL

// Mock delay to simulate network requests
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API calls
export const authAPI = {
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);
    // Mock successful login
    return {
      success: true,
      data: {
        user: {
          id: '1',
          email,
          firstName: 'John',
          lastName: 'Doe',
          role: 'alumni',
          graduationYear: 2020,
          course: 'Computer Science',
          company: 'Tech Corp',
          position: 'Senior Developer',
          profilePicture: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400',
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token'
      }
    };
  },

  register: async (userData: Partial<User>, password: string): Promise<ApiResponse<{ user: User; token: string }>> => {
    await delay(1000);
    return {
      success: true,
      data: {
        user: {
          id: Math.random().toString(),
          ...userData,
          createdAt: new Date().toISOString()
        } as User,
        token: 'mock-jwt-token'
      }
    };
  },

  logout: async (): Promise<ApiResponse<null>> => {
    await delay(500);
    return { success: true, data: null };
  }
};

// Alumni API calls
export const alumniAPI = {
  getAlumni: async (filters?: FilterOptions): Promise<ApiResponse<Alumni[]>> => {
    await delay(800);
    const mockAlumni: Alumni[] = [
      {
        id: '1',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'alumni',
        graduationYear: 2018,
        course: 'Computer Science',
        company: 'Microsoft',
        position: 'Senior Software Engineer',
        bio: 'Passionate about AI and machine learning. Love mentoring students.',
        skills: ['JavaScript', 'Python', 'Machine Learning'],
        linkedIn: 'alice-johnson',
        profilePicture: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
        mentorshipAvailable: true,
        createdAt: '2023-01-15T08:00:00Z'
      },
      {
        id: '2',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'alumni',
        graduationYear: 2019,
        course: 'Business Administration',
        company: 'Goldman Sachs',
        position: 'Investment Banker',
        bio: 'Finance expert with 5+ years in investment banking.',
        skills: ['Finance', 'Analysis', 'Leadership'],
        linkedIn: 'bob-smith',
        profilePicture: 'https://images.pexels.com/photos/927022/pexels-photo-927022.jpeg?auto=compress&cs=tinysrgb&w=400',
        mentorshipAvailable: false,
        createdAt: '2023-02-20T10:30:00Z'
      }
    ];
    
    return { success: true, data: mockAlumni };
  },

  getAlumniById: async (id: string): Promise<ApiResponse<Alumni>> => {
    await delay(500);
    const alumni = await alumniAPI.getAlumni();
    const found = alumni.data.find(a => a.id === id);
    return { success: !!found, data: found! };
  },

  updateProfile: async (id: string, updates: Partial<Alumni>): Promise<ApiResponse<Alumni>> => {
    await delay(1000);
    return {
      success: true,
      data: { ...updates, id } as Alumni,
      message: 'Profile updated successfully'
    };
  }
};

// Events API calls
export const eventsAPI = {
  getEvents: async (): Promise<ApiResponse<Event[]>> => {
    await delay(600);
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Annual Alumni Networking Gala',
        description: 'Join us for an evening of networking, dinner, and celebration of our alumni achievements.',
        date: '2025-03-15',
        time: '18:00',
        location: 'Grand Ballroom, City Hotel',
        type: 'networking',
        maxAttendees: 200,
        currentAttendees: 87,
        registeredUsers: [],
        imageUrl: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=800',
        organizer: 'Alumni Association',
        createdAt: '2024-12-01T09:00:00Z'
      },
      {
        id: '2',
        title: 'Tech Career Workshop',
        description: 'Learn about the latest trends in technology and career opportunities.',
        date: '2025-02-20',
        time: '14:00',
        location: 'Online - Zoom',
        type: 'workshop',
        maxAttendees: 100,
        currentAttendees: 45,
        registeredUsers: [],
        imageUrl: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
        organizer: 'CS Alumni Chapter',
        createdAt: '2024-11-15T14:30:00Z'
      }
    ];
    
    return { success: true, data: mockEvents };
  },

  registerForEvent: async (eventId: string, userId: string): Promise<ApiResponse<null>> => {
    await delay(800);
    return {
      success: true,
      data: null,
      message: 'Successfully registered for event'
    };
  }
};

// Mentorship API calls
export const mentorshipAPI = {
  getMentorshipRequests: async (userId?: string): Promise<ApiResponse<MentorshipRequest[]>> => {
    await delay(700);
    const mockRequests: MentorshipRequest[] = [
      {
        id: '1',
        studentId: 'student-1',
        mentorId: 'alumni-1',
        status: 'pending',
        subject: 'Career Guidance in Software Development',
        message: 'I would love to get guidance on transitioning into a software development career.',
        goals: 'Learn about industry expectations and skill development',
        duration: '3 months',
        createdAt: '2024-12-15T10:00:00Z',
        updatedAt: '2024-12-15T10:00:00Z'
      }
    ];
    
    return { success: true, data: mockRequests };
  },

  createMentorshipRequest: async (request: Partial<MentorshipRequest>): Promise<ApiResponse<MentorshipRequest>> => {
    await delay(1000);
    return {
      success: true,
      data: {
        id: Math.random().toString(),
        ...request,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as MentorshipRequest,
      message: 'Mentorship request submitted successfully'
    };
  },

  updateMentorshipRequest: async (id: string, updates: Partial<MentorshipRequest>): Promise<ApiResponse<MentorshipRequest>> => {
    await delay(800);
    return {
      success: true,
      data: { id, ...updates } as MentorshipRequest,
      message: 'Mentorship request updated successfully'
    };
  }
};

// Donations API calls
export const donationsAPI = {
  getDonations: async (): Promise<ApiResponse<Donation[]>> => {
    await delay(600);
    const mockDonations: Donation[] = [
      {
        id: '1',
        donorId: 'alumni-1',
        amount: 500,
        purpose: 'Scholarship Fund',
        isRecurring: false,
        status: 'completed',
        donorName: 'Alice Johnson',
        isAnonymous: false,
        createdAt: '2024-12-10T15:30:00Z'
      },
      {
        id: '2',
        donorId: 'alumni-2',
        amount: 100,
        purpose: 'General Fund',
        isRecurring: true,
        frequency: 'monthly',
        status: 'completed',
        isAnonymous: true,
        createdAt: '2024-12-05T09:15:00Z'
      }
    ];
    
    return { success: true, data: mockDonations };
  },

  createDonation: async (donation: Partial<Donation>): Promise<ApiResponse<Donation>> => {
    await delay(1200);
    return {
      success: true,
      data: {
        id: Math.random().toString(),
        ...donation,
        status: 'completed',
        createdAt: new Date().toISOString()
      } as Donation,
      message: 'Donation processed successfully'
    };
  }
};