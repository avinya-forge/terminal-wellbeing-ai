import { handleProfileCommand } from './profile';
import { updateUserProfile, clearProfile, exportProfileData } from '../../utils/sessionManager';

// Mock sessionManager
jest.mock('../../utils/sessionManager', () => ({
  getUserProfile: jest.fn(() => ({
    userName: 'TestUser',
    preferences: { tone: 'empathetic', responseLength: 'medium' },
    messageCount: 10,
    triggerWarnings: ['test']
  })),
  updateUserProfile: jest.fn(),
  clearProfile: jest.fn(),
  exportProfileData: jest.fn(() => '{"mock": "data"}')
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

  it('should validate name length', async () => {
    const longName = 'a'.repeat(51);
    const result = await handleProfileCommand({ command: 'profile', args: ['name', longName], originalInput: `/profile name ${longName}` });
    expect(result).toContain('Name is too long');
    expect(updateUserProfile).not.toHaveBeenCalled();
  });

  it('should validate name characters', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['name', 'Bad@Name'], originalInput: '/profile name Bad@Name' });
    expect(result).toContain('Name contains invalid characters');
    expect(updateUserProfile).not.toHaveBeenCalled();
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

  it('should handle reset', async () => {
    // Initial request
    let result = await handleProfileCommand({ command: 'profile', args: ['reset'], originalInput: '/profile reset' });
    expect(result).toContain('Are you sure');
    expect(clearProfile).not.toHaveBeenCalled();

    // Confirm
    result = await handleProfileCommand({ command: 'profile', args: ['reset', 'confirm'], originalInput: '/profile reset confirm' });
    expect(result).toContain('reset to defaults');
    expect(clearProfile).toHaveBeenCalled();
  });

  it('should handle export', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['export'], originalInput: '/profile export' });
    expect(result).toContain('mock": "data');
    expect(exportProfileData).toHaveBeenCalled();
  });

  it('should handle view', async () => {
    const result = await handleProfileCommand({ command: 'profile', args: ['view'], originalInput: '/profile view' });
    expect(result).toContain('User Profile Details');
    expect(result).toContain('TestUser');
  });
});
