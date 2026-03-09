import { handleResourcesCommand } from './resources';
import { searchResources } from '../../data/resources';

jest.mock('../../data/resources', () => ({
  searchResources: jest.fn(),
}));

describe('resources handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all resources when no query is provided', async () => {
    const parsed = { command: 'resources', args: [], original: '/resources' };
    (searchResources as jest.Mock).mockReturnValue([
      { name: 'Resource 1', category: 'General', contact: '123-456', description: 'Desc 1' },
      { name: 'Resource 2', category: 'Crisis', contact: '911', description: 'Desc 2' },
      { name: 'Resource 3', category: 'Youth', contact: 'http://youth.com', description: 'Desc 3' },
      { name: 'Resource 4', category: 'General', contact: '456-789', description: 'Desc 4' },
      { name: 'Resource 5', category: 'General', contact: 'abc', description: 'Desc 5' },
      { name: 'Resource 6', category: 'General', contact: 'def', description: 'Desc 6' },
    ]);

    const response = await handleResourcesCommand(parsed);
    expect(searchResources).toHaveBeenCalledWith('');
    expect(response).toContain('Mental Health Resources:');
    expect(response).toContain('Resource 1 [General]');
    expect(response).toContain('123-456');
    expect(response).toContain('Desc 1');
    expect(response).toContain('Tip: You can search resources by typing /resources <topic>');
  });

  it('should return error when no resources found for query', async () => {
    const parsed = { command: 'resources', args: ['unknown', 'topic'], original: '/resources unknown topic' };
    (searchResources as jest.Mock).mockReturnValue([]);

    const response = await handleResourcesCommand(parsed);
    expect(searchResources).toHaveBeenCalledWith('unknown topic');
    expect(response).toContain('No resources found for "unknown topic"');
    expect(response).toContain('Try simpler keywords');
  });

  it('should list matching resources with sign of strength message if <= 5 resources', async () => {
    const parsed = { command: 'resources', args: ['crisis'], original: '/resources crisis' };
    (searchResources as jest.Mock).mockReturnValue([
      { name: 'Resource 1', category: 'Crisis', contact: '911', description: 'Emergency' }
    ]);

    const response = await handleResourcesCommand(parsed);
    expect(searchResources).toHaveBeenCalledWith('crisis');
    expect(response).toContain('Mental Health Resources matching "crisis":');
    expect(response).toContain('Resource 1 [Crisis]');
    expect(response).toContain('911');
    expect(response).toContain('Emergency');
    expect(response).toContain('Remember, seeking help is a sign of strength.');
  });

  it('should list matching resources with sign of strength message if > 5 resources but has matching title', async () => {
    const parsed = { command: 'resources', args: ['general'], original: '/resources general' };
    (searchResources as jest.Mock).mockReturnValue([
      { name: 'Resource 1', category: 'General', contact: '1', description: '1' },
      { name: 'Resource 2', category: 'General', contact: '2', description: '2' },
      { name: 'Resource 3', category: 'General', contact: '3', description: '3' },
      { name: 'Resource 4', category: 'General', contact: '4', description: '4' },
      { name: 'Resource 5', category: 'General', contact: '5', description: '5' },
      { name: 'Resource 6', category: 'General', contact: '6', description: '6' }
    ]);

    const response = await handleResourcesCommand(parsed);
    expect(searchResources).toHaveBeenCalledWith('general');
    expect(response).toContain('Mental Health Resources matching "general":');
    expect(response).toContain('Remember, seeking help is a sign of strength.');
  });
});
