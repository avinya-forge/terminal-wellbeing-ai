import { searchResources, getResourcesByCategory, getCategories, getAllResources } from './resources';

describe('Resource Data', () => {
  describe('getAllResources', () => {
    it('should return all resources', () => {
      const resources = getAllResources();
      expect(resources.length).toBeGreaterThan(0);
      expect(resources[0]).toHaveProperty('id');
      expect(resources[0]).toHaveProperty('name');
    });
  });

  describe('searchResources', () => {
    it('should return all resources for empty query', () => {
      const resources = searchResources('');
      expect(resources).toEqual(getAllResources());
    });

    it('should find resources by name (case-insensitive)', () => {
      const results = searchResources('trevor');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].name).toContain('Trevor');
    });

    it('should find resources by tag', () => {
      const results = searchResources('suicide');
      expect(results.length).toBeGreaterThan(0);
      const hasSuicideTag = results.every(r =>
        r.tags.includes('suicide') ||
        r.name.toLowerCase().includes('suicide') ||
        r.description.toLowerCase().includes('suicide')
      );
      expect(hasSuicideTag).toBe(true);
    });

    it('should find resources by category', () => {
      const results = searchResources('veterans');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].category).toBe('Veterans');
    });

    it('should return empty array for no matches', () => {
      const results = searchResources('xyznonexistentquery');
      expect(results).toEqual([]);
    });
  });

  describe('getResourcesByCategory', () => {
    it('should return resources for a specific category', () => {
      const results = getResourcesByCategory('LGBTQ+');
      expect(results.length).toBeGreaterThan(0);
      expect(results.every(r => r.category === 'LGBTQ+')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const results = getResourcesByCategory('lgbtq+');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getCategories', () => {
    it('should return a list of unique categories', () => {
      const categories = getCategories();
      expect(categories.length).toBeGreaterThan(0);
      expect(new Set(categories).size).toBe(categories.length);
    });
  });
});
