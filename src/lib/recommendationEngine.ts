export interface ServiceCandidate {
  id: string;
  title: string;
  category: string;
  tags: string[];
  vendorRating: number;
}

export interface RecommendationProfile {
  preferredCategories: string[];
  preferredTags: string[];
  minimumVendorRating?: number;
}

export interface ScoredRecommendation {
  service: ServiceCandidate;
  score: number;
}

const normalize = (value: string) => value.trim().toLowerCase();

export function scoreService(service: ServiceCandidate, profile: RecommendationProfile): number {
  const normalizedCategory = normalize(service.category);
  const categorySet = new Set(profile.preferredCategories.map(normalize));
  const tagSet = new Set(profile.preferredTags.map(normalize));

  let score = 0;

  if (categorySet.has(normalizedCategory)) {
    score += 40;
  }

  const tagMatches = service.tags
    .map(normalize)
    .filter((tag) => tagSet.has(tag)).length;

  score += tagMatches * 15;
  score += Math.round(service.vendorRating * 10);

  if (profile.minimumVendorRating && service.vendorRating < profile.minimumVendorRating) {
    score -= 25;
  }

  return score;
}

export function recommendServices(
  services: ServiceCandidate[],
  profile: RecommendationProfile,
  limit = 3
): ScoredRecommendation[] {
  return services
    .map((service) => ({ service, score: scoreService(service, profile) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.max(1, limit));
}
