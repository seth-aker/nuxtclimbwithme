// test-setup.ts
import { vi } from 'vitest'
import type { H3Event } from 'h3'
import type { IUser, IClimbingDiscipline } from '~/server/models/User'
import { AwsClient } from 'aws4fetch'
import mongoose from 'mongoose'

// Mock dependencies
export const mockUser = {
  find: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
}

export const mockFindUserBySub = vi.fn()
export const mockGetValidatedQuery = vi.fn()
export const mockCreateError = vi.fn()


  vi.mock('~/server/models/User', () => ({
    default: mockUser,
  }))

  vi.mock('~/server/utils/findUserBySub', () => ({
    default: mockFindUserBySub,
  }))
  vi.mock('h3', async () => {
    const actual = await vi.importActual('h3')
    return {
      ...actual,
      getQuery: vi.fn(),
      readBody: vi.fn(),
      createError: mockCreateError,
      setResponseStatus: vi.fn(),
      getValidatedQuery: mockGetValidatedQuery,
      
    }
  })
  vi.stubGlobal('defineEventHandler', (handler: any) => handler)

  vi.mock('~/assets/lists/daysOfWeek', () => ({
    daysOfWeek: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const
  }))

// Mock data factory
export const createMockUser = (overrides: Partial<IUser> = {}): IUser => ({
  _id: new mongoose.Types.ObjectId(),
  authId: 'auth123',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  location: {
    geoJSON: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749] // San Francisco
    },
    locatedAt: Date.now(),
    address: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zip: 94102
    }
  },
  climbingExperience: {
    disciplines: [
      { name: 'Bouldering', grade: 'V4', yearsExperience: 3, certified: true },
      { name: 'Sport', grade: '5.10a', yearsExperience: 2, certified: false }
    ]
  },
  availability: {
    monday: ['Morning', 'Evening'],
    tuesday: ['Afternoon'],
    wednesday: ['Morning'],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  },
  preferences: {
    colorTheme: 'system',
    openToClimbingTypes: [
      { name: 'Bouldering', preferredGrade: 'V4', certified: true },
      { name: 'Sport', preferredGrade: '5.10a', certified: false }
    ],
    searchRadius: 50
  },
  interests: ['hiking', 'photography', 'camping'],
  gearOwned: ['harness', 'shoes', 'chalk bag'],
  communitiesJoined: [new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')],
  connections: [],
  requestsSent: [],
  requestsReceived: [],
  blocked: [],
  registrationCompleted: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides
})

// Helper functions for creating specific user types
export const createMockUserWithLocation = (coordinates: [number, number]) => 
  createMockUser({
    location: {
      geoJSON: {
        type: 'Point',
        coordinates
      }
    }
  })

export const createMockUserWithDisciplines = (disciplines: IClimbingDiscipline[]) =>
  createMockUser({
    climbingExperience: { disciplines }
  })

export const createMockUserWithAvailability = (availability: Partial<IUser['availability']>) =>
  createMockUser({
    availability: {
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: [],
      ...availability
    }
  })

// Mock factory for different user scenarios
export const mockUserFactory = {
  beginner: () => createMockUser({
    climbingExperience: {
      disciplines: [
        { name: 'Top Rope', grade: '5.6', yearsExperience: 0.5, certified: false }
      ]
    },
    preferences: {
      colorTheme: 'system',
      openToClimbingTypes: [
        { name: 'Top Rope', preferredGrade: '5.7' }
      ],
      searchRadius: 25
    }
  }),
  
  advanced: () => createMockUser({
    climbingExperience: {
      disciplines: [
        { name: 'Bouldering', grade: 'V8', yearsExperience: 5, certified: true },
        { name: 'Sport', grade: '5.12a', yearsExperience: 4, certified: true },
        { name: 'Trad', grade: '5.10d', yearsExperience: 3, certified: false }
      ]
    },
    preferences: {
      colorTheme: 'dark',
      openToClimbingTypes: [
        { name: 'Bouldering', preferredGrade: 'V6-V8', certified: true },
        { name: 'Sport', preferredGrade: '5.11+', certified: true }
      ],
      searchRadius: 75
    }
  }),
  
  instructor: () => createMockUser({
    climbingExperience: {
      disciplines: [
        { name: 'Top Rope', grade: '5.11a', yearsExperience: 8, certified: true },
        { name: 'Sport', grade: '5.10d', yearsExperience: 6, certified: true },
        { name: 'Bouldering', grade: 'V6', yearsExperience: 5, certified: true }
      ]
    },
    gearOwned: ['quickdraws', 'rope', 'harness', 'helmet', 'belay device', 'cams', 'nuts'],
    interests: ['teaching', 'safety', 'gear', 'climbing history']
  })
}

// Setup default mock behaviors
export const setupDefaultMocks = (mockCurrentUser: IUser, mockOtherUser: IUser) => {
  mockFindUserBySub.mockResolvedValue(mockCurrentUser)
  mockGetValidatedQuery.mockResolvedValue({
    searchRadius: 50,
    limit: 20
  })
  mockCreateError.mockImplementation((error) => new Error(error.statusMessage))

  // Mock the chained methods for database queries
  const mockQuery = {
    select: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    then: vi.fn().mockResolvedValue([mockOtherUser])
  }
  mockUser.find.mockReturnValue(mockQuery)
}

// Create mock event
export const createMockEvent = (): Partial<H3Event> => ({
  context: {
    mongoose: {} as mongoose.Connection,
    aws: {} as AwsClient
  },
  node: {
    req: {} as any,
    res: {} as any
  }
})

// Test data constants
export const TEST_COORDINATES = {
  sanFrancisco: [-122.4194, 37.7749] as [number, number],
  closeSF: [-122.4094, 37.7849] as [number, number],
  newYork: [-74.0059, 40.7128] as [number, number]
}

export const TEST_OBJECT_IDS = {
  user1: new mongoose.Types.ObjectId('507f1f77bcf86cd799439001'),
  user2: new mongoose.Types.ObjectId('507f1f77bcf86cd799439002'),
  community1: new mongoose.Types.ObjectId('507f1f77bcf86cd799439011'),
  community2: new mongoose.Types.ObjectId('507f1f77bcf86cd799439012')
}
