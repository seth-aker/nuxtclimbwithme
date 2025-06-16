// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createMockUser } from '~/vitest.setup'
import type { IUser, IClimbingDiscipline } from '~/server/models/User'
import mongoose from 'mongoose'
import {
  calculateCompatabilityScore,
  calculateDistance,
  calculateClimbingCompatability,
  calculateInterestsCompatability,
  calculateAvailabilityCompatability,
  calculateCommunitiesOverlapScore,
  SCORING_WEIGHTS
} from './calculateScores'

describe('Calculate Scores Utility Functions', () => {
  let mockCurrentUser: IUser
  let mockOtherUser: IUser

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
  })

  describe('SCORING_WEIGHTS', () => {
    it('should have correct scoring weights that sum to 1', () => {
      const totalWeight = Object.values(SCORING_WEIGHTS).reduce((sum, weight) => sum + weight, 0)
      expect(totalWeight).toBe(1)
      expect(SCORING_WEIGHTS.DISTANCE).toBe(0.3)
      expect(SCORING_WEIGHTS.CLIMBING_DISCIPLINES).toBe(0.25)
      expect(SCORING_WEIGHTS.INTERESTS).toBe(0.2)
      expect(SCORING_WEIGHTS.AVAILABILITY).toBe(0.15)
      expect(SCORING_WEIGHTS.COMMUNITIES_JOINED_OVERLAP).toBe(0.1)
    })
  })

  describe('calculateDistance', () => {
    it('should calculate distance between two coordinates', () => {
      const coords1 = [-122.4194, 37.7749] // San Francisco
      const coords2 = [-122.4094, 37.7849] // Close point
      
      const distance = calculateDistance(coords1, coords2)
      
      expect(distance).toBeGreaterThan(0)
      expect(distance).toBeLessThan(10) // Should be less than 10 miles
    })

    it('should return 0 for identical coordinates', () => {
      const coords = [-122.4194, 37.7749]
      
      const distance = calculateDistance(coords, coords)
      
      expect(distance).toBe(0)
    })

    it('should handle edge cases with empty coordinates', () => {
      const distance = calculateDistance([], [])
      
      expect(distance).toBe(-1)
    })

    it('should handle invalid coordinate arrays', () => {
      expect(calculateDistance([1], [2, 3])).toBe(-1)
      expect(calculateDistance([1, 2, 3], [4, 5])).toBe(-1)
    })
  })

  describe('calculateClimbingCompatability', () => {
    it('should return 0 when one user has no disciplines', () => {
      const score = calculateClimbingCompatability(
        [], 
        mockOtherUser.climbingExperience.disciplines, 
        mockCurrentUser.preferences.openToClimbingTypes
      )
      
      expect(score).toBe(0)
    })

    it('should return 0 when users have no common climbing types', () => {
      const userDisciplines: IClimbingDiscipline[] = [
        { name: 'Ice', grade: 'WI3', yearsExperience: 1, certified: false }
      ]
      const otherUserDisciplines: IClimbingDiscipline[] = [
        { name: 'Aid', grade: 'A2', yearsExperience: 1, certified: false }
      ]
      
      const score = calculateClimbingCompatability(userDisciplines, otherUserDisciplines, [])
      
      expect(score).toBe(0)
    })

    it('should calculate base score for common climbing types', () => {
      const score = calculateClimbingCompatability(
        mockCurrentUser.climbingExperience.disciplines,
        mockOtherUser.climbingExperience.disciplines,
        mockCurrentUser.preferences.openToClimbingTypes
      )
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should add certification bonus', () => {
      const user: IClimbingDiscipline[] = [
        { name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: false },
        { name: 'Sport', grade: '5.11a', yearsExperience: 2, certified: false }
      ];

      const otherUserWithCert: IClimbingDiscipline[] = [
        { name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: true }
      ];

      const otherUserWithoutCert: IClimbingDiscipline[] = [
        { name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: false }
      ];

      const scoreWithCert = calculateClimbingCompatability(
        user,
        otherUserWithCert,
        [{ name: 'Bouldering' }]
      );

      const scoreWithoutCert = calculateClimbingCompatability(
        user,
        otherUserWithoutCert,
        [{ name: 'Bouldering' }]
      );

      expect(scoreWithCert).toBeGreaterThan(scoreWithoutCert);
      expect(scoreWithCert).toBeLessThanOrEqual(1);
      expect(scoreWithoutCert).toBeLessThanOrEqual(1);
    });

    it('should add preferred grade bonus', () => {
      const userPreferences = [{ name: 'Bouldering' as const, preferredGrade: 'V4' }]
      const otherUserDisciplines: IClimbingDiscipline[] = [
        { name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: false }
      ]
      
      const score = calculateClimbingCompatability(
        [{ name: 'Bouldering', grade: 'V4', yearsExperience: 2, certified: false }],
        otherUserDisciplines,
        userPreferences
      )
      
      expect(score).toBeGreaterThan(0.2) // Should include grade bonus
    })

    it('should cap score at 1', () => {
      // Create scenario that would exceed 1 without capping
      const manyDisciplines: IClimbingDiscipline[] = [
        'Bouldering', 'Sport', 'Top Rope', 'Trad', 'Aid'
      ].map(name => ({ 
        name: name as IClimbingDiscipline['name'], 
        grade: 'V4', 
        yearsExperience: 3,
        certified: true 
      }))
      
      const score = calculateClimbingCompatability(
        manyDisciplines,
        manyDisciplines,
        manyDisciplines.map(d => ({ name: d.name, preferredGrade: d.grade, certified: true }))
      )
      
      expect(score).toBeLessThanOrEqual(1)
    })
  })

  describe('calculateInterestsCompatability', () => {
    it('should return 0 when one user has no interests', () => {
      const score = calculateInterestsCompatability([], ['hiking', 'climbing'])
      
      expect(score).toBe(0)
    })

    it('should calculate compatibility based on common interests', () => {
      const userInterests = ['hiking', 'photography', 'camping']
      const otherUserInterests = ['hiking', 'yoga', 'reading']
      
      const score = calculateInterestsCompatability(userInterests, otherUserInterests)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
      // Should be 1/3 since 1 common interest out of max 3 interests
      expect(score).toBeCloseTo(1/3, 2)
    })

    it('should be case insensitive', () => {
      const userInterests = ['HIKING', 'Photography']
      const otherUserInterests = ['hiking', 'PHOTOGRAPHY']
      
      const score = calculateInterestsCompatability(userInterests, otherUserInterests)
      
      expect(score).toBe(1) // Perfect match
    })

    it('should handle perfect overlap', () => {
      const interests = ['hiking', 'climbing', 'photography']
      
      const score = calculateInterestsCompatability(interests, interests)
      
      expect(score).toBe(1)
    })
  })

  describe('calculateAvailabilityCompatability', () => {
    it('should return 0 when users have no overlapping availability', () => {
      const userAvailability: IUser['availability'] = {
        monday: ['Morning'],
        tuesday: ['Afternoon'],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
      const otherUserAvailability: IUser['availability'] = {
        monday: [],
        tuesday: [],
        wednesday: ['Evening'],
        thursday: ['Morning'],
        friday: [],
        saturday: [],
        sunday: []
      }
      
      const score = calculateAvailabilityCompatability(userAvailability, otherUserAvailability)
      
      expect(score).toBe(0)
    })

    it('should calculate overlap correctly', () => {
      const userAvailability: IUser['availability'] = {
        monday: ['Morning', 'Evening'],
        tuesday: ['Afternoon'],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
      const otherUserAvailability: IUser['availability'] = {
        monday: ['Morning'],
        tuesday: ['Afternoon', 'Evening'],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
      
      const score = calculateAvailabilityCompatability(userAvailability, otherUserAvailability)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should handle perfect availability match', () => {
      const availability: IUser['availability'] = {
        monday: ['Morning'],
        tuesday: ['Afternoon'],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
      
      const score = calculateAvailabilityCompatability(availability, availability)
      
      expect(score).toBe(1)
    })

    it('should handle empty availability gracefully', () => {
      const emptyAvailability: IUser['availability'] = {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      }
      
      const score = calculateAvailabilityCompatability(emptyAvailability, emptyAvailability)
      
      expect(score).toBe(0)
    })
  })

  describe('calculateCommunitiesOverlapScore', () => {
    it('should return 0 when one user has no communities', () => {
      const communities = [new mongoose.Types.ObjectId()]
      
      const score = calculateCommunitiesOverlapScore([], communities)
      
      expect(score).toBe(0)
    })

    it('should calculate overlap score correctly', () => {
      const sharedCommunity = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
      const userCommunities = [sharedCommunity, new mongoose.Types.ObjectId()]
      const otherUserCommunities = [sharedCommunity, new mongoose.Types.ObjectId()]
      
      const score = calculateCommunitiesOverlapScore(userCommunities, otherUserCommunities)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
      expect(score).toBe(0.2) // 1 overlap * 0.2
    })

    it('should cap score at 1', () => {
      const sharedCommunity = new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')
      const communities = Array(10).fill(sharedCommunity)
      
      const score = calculateCommunitiesOverlapScore(communities, communities)
      
      expect(score).toBe(1) // Capped at 1
    })

    it('should handle no overlap', () => {
      const userCommunities = [new mongoose.Types.ObjectId('507f1f77bcf86cd799439011')]
      const otherUserCommunities = [new mongoose.Types.ObjectId('507f1f77bcf86cd799439012')]
      
      const score = calculateCommunitiesOverlapScore(userCommunities, otherUserCommunities)
      
      expect(score).toBe(0)
    })
  })

  describe('calculateCompatabilityScore', () => {
    it('should calculate overall compatibility score', () => {
      const score = calculateCompatabilityScore(mockCurrentUser, mockOtherUser)
      
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should weight different factors correctly', () => {
      // Test that distance affects score
      const farUser = createMockUser({
        location: {
          geoJSON: {
            type: 'Point',
            coordinates: [-74.0059, 40.7128] // NYC, far from SF
          }
        }
      })
      
      const closeScore = calculateCompatabilityScore(mockCurrentUser, mockOtherUser)
      const farScore = calculateCompatabilityScore(mockCurrentUser, farUser)
      
      expect(closeScore).toBeGreaterThan(farScore)
    })

    it('should handle users with minimal data', () => {
      const minimalUser = createMockUser({
        climbingExperience: { disciplines: [] },
        interests: [],
        availability: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: []
        },
        communitiesJoined: []
      })
      
      const score = calculateCompatabilityScore(mockCurrentUser, minimalUser)
      
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should use custom search radius when provided', () => {
      const customRadius = 100
      const score = calculateCompatabilityScore(mockCurrentUser, mockOtherUser, customRadius)
      
      expect(score).toBeGreaterThanOrEqual(0)
      expect(score).toBeLessThanOrEqual(1)
    })

    it('should use default search radius when not provided', () => {
      const score1 = calculateCompatabilityScore(mockCurrentUser, mockOtherUser)
      const score2 = calculateCompatabilityScore(mockCurrentUser, mockOtherUser, undefined)
      
      expect(score1).toBe(score2)
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
