import { handleHelpCommand, handleExportCommand, handleArtCommand } from './system';
import { getHelpResponse } from '../../data/responses';
import { exportSessionData, exportSessionMarkdown } from '../../utils/sessionManager';
import { getAsciiArt } from '../../utils/ascii';

jest.mock('../../data/responses');
jest.mock('../../utils/sessionManager');
jest.mock('../../utils/ascii');

describe('System Commands', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleHelpCommand', () => {
    it('should return help response', async () => {
      (getHelpResponse as jest.Mock).mockReturnValue('Help Response');
      const result = await handleHelpCommand();
      expect(result).toBe('Help Response');
      expect(getHelpResponse).toHaveBeenCalled();
    });
  });

  describe('handleExportCommand', () => {
    it('should return markdown export', async () => {
      (exportSessionMarkdown as jest.Mock).mockReturnValue('Markdown Data');
      const result = await handleExportCommand({ command: 'export', args: ['md'], originalInput: '/export md' });
      expect(result).toContain('Here is your session export (Markdown):');
      expect(result).toContain('Markdown Data');
      expect(exportSessionMarkdown).toHaveBeenCalled();
    });

    it('should return markdown export for "markdown" argument', async () => {
      (exportSessionMarkdown as jest.Mock).mockReturnValue('Markdown Data');
      const result = await handleExportCommand({ command: 'export', args: ['markdown'], originalInput: '/export markdown' });
      expect(result).toContain('Here is your session export (Markdown):');
      expect(result).toContain('Markdown Data');
      expect(exportSessionMarkdown).toHaveBeenCalled();
    });

    it('should return json export for no format argument', async () => {
      (exportSessionData as jest.Mock).mockReturnValue('JSON Data');
      const result = await handleExportCommand({ command: 'export', args: [], originalInput: '/export' });
      expect(result).toContain('Here is your session data export (JSON):');
      expect(result).toContain('JSON Data');
      expect(exportSessionData).toHaveBeenCalled();
    });
  });

  describe('handleArtCommand', () => {
    it('should return usage message if no mood is provided', async () => {
      const result = await handleArtCommand({ command: 'art', args: [], originalInput: '/art' });
      expect(result).toContain('Usage: /art <mood>');
    });

    it('should return ascii art for given mood', async () => {
      (getAsciiArt as jest.Mock).mockReturnValue('ASCII Art');
      const result = await handleArtCommand({ command: 'art', args: ['happy'], originalInput: '/art happy' });
      expect(result).toBe('ASCII Art');
      expect(getAsciiArt).toHaveBeenCalledWith('happy');
    });
  });
});
