import {
  featuredResourceSlugs,
  getInternationalResourceBySlug,
  internationalResources,
} from '@/lib/internationalResources';

describe('Multilingual module - international resources', () => {
  it('returns a resource when slug exists', () => {
    const resource = getInternationalResourceBySlug('india-student-visa-renewal-guide');

    expect(resource).toBeDefined();
    expect(resource?.title).toContain('Visa');
    expect(resource?.country).toBe('India');
  });

  it('returns undefined for unknown slug', () => {
    const resource = getInternationalResourceBySlug('unknown-resource');
    expect(resource).toBeUndefined();
  });

  it('keeps featured slugs aligned with available resources', () => {
    const slugSet = new Set(internationalResources.map((item) => item.slug));

    expect(featuredResourceSlugs.every((slug) => slugSet.has(slug))).toBe(true);
  });
});
