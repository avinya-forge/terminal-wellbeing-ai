import { handleProfileCommand } from './profile';
import { updateUserProfile } from '../../utils/sessionManager';

// Mock sessionManager
jest.mock('../../utils/sessionManager', () => ({
  getUserProfile: jest.fn(() => ({
    userName: 'TestUser',
    preferences: { tone: 'empathetic', responseLength: 'medium' },
    messageCount: 10
  })),
  updateUserProfile: jest.fn()
}));

describe('handleProfileCommand', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show profile when no args', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: [], originalInput: '/profile' });
    expect(result).toContain('Name: TestUser');
    expect(result).toContain('Preferred Tone: empathetic');
  });

  it('should update name', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['name', 'NewName'], originalInput: '/profile name NewName' });
    expect(result).toContain('Profile updated');
    expect(updateUserProfile).toHaveBeenCalledWith({ userName: 'NewName' });
  });

  it('should update tone', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['tone', 'casual'], originalInput: '/profile tone casual' });
    expect(result).toContain('Profile updated');
    expect(updateUserProfile).toHaveBeenCalledWith(expect.objectContaining({
      preferences: expect.objectContaining({ tone: 'casual' })
    }));
  });

  it('should validate tone', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['tone', 'invalid'], originalInput: '/profile tone invalid' });
    expect(result).toContain('Invalid tone');
    expect(updateUserProfile).not.toHaveBeenCalled();
  });
});
