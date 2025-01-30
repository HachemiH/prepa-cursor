import { describe, it, expect, vi } from 'vitest';

describe('Test de base', () => {
  it('devrait passer', () => {
    expect(true).toBe(true);
  });

  it('devrait pouvoir mocker une fonction', () => {
    const mockFn = vi.fn().mockReturnValue('test');
    expect(mockFn()).toBe('test');
    expect(mockFn).toHaveBeenCalled();
  });
});
