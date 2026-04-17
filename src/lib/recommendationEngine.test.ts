import {
  recommendServices,
  scoreService,
  type RecommendationProfile,
  type ServiceCandidate,
} from '@/lib/recommendationEngine';

describe('Recommendation Engine module', () => {
  const profile: RecommendationProfile = {
    preferredCategories: ['Transportation', 'Health & Wellness'],
    preferredTags: ['discount', 'student-friendly', 'fast'],
    minimumVendorRating: 4.0,
  };

  const services: ServiceCandidate[] = [
    {
      id: 'transport-1',
      title: 'Campus Shuttle Plus',
      category: 'Transportation',
      tags: ['fast', 'discount'],
      vendorRating: 4.6,
    },
    {
      id: 'food-1',
      title: 'Budget Bites',
      category: 'Food Delivery',
      tags: ['discount'],
      vendorRating: 4.7,
    },
    {
      id: 'health-1',
      title: 'Wellness Hub',
      category: 'Health & Wellness',
      tags: ['student-friendly'],
      vendorRating: 3.8,
    },
  ];

  it('scores category and tag matches higher', () => {
    const score = scoreService(services[0], profile);
    expect(score).toBeGreaterThan(100);
  });

  it('applies penalty when vendor rating is below minimum threshold', () => {
    const score = scoreService(services[2], profile);
    expect(score).toBeLessThan(80);
  });

  it('returns sorted recommendations and respects limit', () => {
    const ranked = recommendServices(services, profile, 2);

    expect(ranked).toHaveLength(2);
    expect(ranked[0].service.id).toBe('transport-1');
    expect(ranked[0].score).toBeGreaterThanOrEqual(ranked[1].score);
  });
});
