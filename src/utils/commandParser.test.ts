import { parseCommand } from './commandParser';

describe('Command Parser', () => {
  it('should parse simple slash commands', () => {
    expect(parseCommand('/help')).toEqual({
      command: 'help',
      args: [],
      originalInput: '/help'
    });
  });

  it('should parse commands with arguments', () => {
    expect(parseCommand('/model 1')).toEqual({
      command: 'model',
      args: ['1'],
      originalInput: '/model 1'
    });
  });

  it('should handle quoted arguments', () => {
    expect(parseCommand('/search "mental health"')).toEqual({
      command: 'search',
      args: ['mental health'],
      originalInput: '/search "mental health"'
    });

    expect(parseCommand("/echo 'hello world'")).toEqual({
      command: 'echo',
      args: ['hello world'],
      originalInput: "/echo 'hello world'"
    });
  });

  it('should handle mixed quotes and plain args', () => {
    expect(parseCommand('/cmd arg1 "arg 2" arg3')).toEqual({
      command: 'cmd',
      args: ['arg1', 'arg 2', 'arg3'],
      originalInput: '/cmd arg1 "arg 2" arg3'
    });
  });

  it('should handle non-slash commands', () => {
    expect(parseCommand('help')).toEqual({
      command: 'help',
      args: [],
      originalInput: 'help'
    });

    expect(parseCommand('help me')).toEqual({
      command: 'help',
      args: ['me'],
      originalInput: 'help me'
    });
  });

  it('should handle empty input', () => {
    expect(parseCommand('')).toBeNull();
    expect(parseCommand('   ')).toBeNull();
  });

  it('should handle just slash', () => {
    expect(parseCommand('/')).toBeNull();
  });

  it('should handle slash with space', () => {
    expect(parseCommand('/ help')).toEqual({
      command: 'help',
      args: [],
      originalInput: '/ help'
    });
  });

  it('should handle empty quotes', () => {
    expect(parseCommand('/echo ""')).toEqual({
      command: 'echo',
      args: [''],
      originalInput: '/echo ""'
    });
  });
});
