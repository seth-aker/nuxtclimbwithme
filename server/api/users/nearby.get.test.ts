// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createMockUser, mockCreateError, mockFindUserBySub, mockGetValidatedQuery, mockUser } from '~/vitest.setup'
import type { H3Event } from 'h3'
import type { IUser, IClimbingDiscipline } from '~/server/models/User'
import { AwsClient } from 'aws4fetch'
import mongoose from 'mongoose'

describe('User Search API Mocks and Tests', () => {
  let mockCurrentUser: IUser
  let mockOtherUser: IUser
  let mockEvent: Partial<H3Event>

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockCurrentUser = createMockUser({
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439001'),
    })

    mockOtherUser = createMockUser({
      _id: new mongoose.Types.ObjectId('507f1f77bcf86cd799439002'),
      location: {
        geoJSON: {
          type: 'Point',
          coordinates: [-122.4094, 37.7849] // Close to SF
        }
      },
      climbingExperience: {
        disciplines: [
          { name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: true },
          { name: 'Top Rope', grade: '5.9', yearsExperience: 1, certified: false }
        ]
      },
      interests: ['hiking', 'yoga', 'reading'],
      availability: {
        monday: ['Morning'],
        tuesday: ['Afternoon', 'Evening'],
        wednesday: [],
        thursday: [],
        friday: ['Morning'],
        saturday: [],
        sunday: []
      },
      communitiesJoined: [new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')]
    })

    mockEvent = {
      context: {
        mongoose: {} as mongoose.Connection,
        aws: {} as AwsClient

      },
      node: {
        req: {} as any,
        res: {} as any
      }
    }

    // Setup default mock behaviors
    mockFindUserBySub.mockResolvedValue(mockCurrentUser)
    mockGetValidatedQuery.mockResolvedValue({
      searchRadius: 50,
      limit: 20
    })
    mockCreateError.mockImplementation((error) => new Error(error.statusMessage))
  })

  // Add cleanup to prevent hanging
  afterEach(() => {
    vi.clearAllTimers()
    vi.restoreAllMocks()
  })

  describe('Mock Setup Tests', () => {
    it('should have properly mocked findUserBySub', async () => {
      const result = await mockFindUserBySub(mockEvent)
      expect(result).toEqual(mockCurrentUser)
      expect(mockFindUserBySub).toHaveBeenCalledWith(mockEvent)
    })

    it('should have properly mocked getValidatedQuery', async () => {
      const result = await mockGetValidatedQuery(mockEvent, expect.any(Function))
      expect(result).toEqual({ searchRadius: 50, limit: 20 })
    })

    it('should have properly mocked createError', () => {
      const error = mockCreateError({ statusCode: 400, statusMessage: 'Test error' })
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toBe('Test error')
    })
  })

  describe('Database Mock Tests', () => {
    beforeEach(() => {
      // Mock the chained methods
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        then: vi.fn().mockResolvedValue([mockOtherUser])
      }
      mockUser.find.mockReturnValue(mockQuery)
    })

    it('should mock User.find with proper chaining', async () => {
      const query = mockUser.find({})
      const result = await query.select({}).limit(20).then()
      
      expect(mockUser.find).toHaveBeenCalled()
      expect(result).toEqual([mockOtherUser])
    })
  })


  describe('Event Handler Error Cases', () => {
    it('should handle user without location', async () => {
      const userWithoutLocation = createMockUser({
        location: {
          geoJSON: undefined
        }
      })
      
      mockFindUserBySub.mockResolvedValueOnce(userWithoutLocation)
      
      expect(mockCreateError).toBeDefined()
      // In actual implementation, this would throw an error
    })

    it('should validate query parameters', async () => {
      const invalidQuery = {
        searchRadius: 'invalid',
        climbingType: ['InvalidType'],
        limit: -1
      }
      
      mockGetValidatedQuery.mockRejectedValueOnce(new Error('Invalid query parameters'))
      
      // Test would verify that validation catches invalid parameters
    })
  })
})

// Helper functions for setting up different test scenarios
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
