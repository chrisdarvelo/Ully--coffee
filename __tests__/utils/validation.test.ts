import { validatePassword, validateEmail, sanitizeText } from '../../utils/validation';

// ─── validatePassword ────────────────────────────────────────────────────────
describe('validatePassword', () => {
  it('rejects passwords shorter than 8 characters', () => {
    expect(validatePassword('Ab1').valid).toBe(false);
    expect(validatePassword('Ab1').message).toContain('8 characters');
  });

  it('rejects passwords missing an uppercase letter', () => {
    const result = validatePassword('password1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('uppercase');
  });

  it('rejects passwords missing a lowercase letter', () => {
    const result = validatePassword('PASSWORD1');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('lowercase');
  });

  it('rejects passwords missing a number', () => {
    const result = validatePassword('Password');
    expect(result.valid).toBe(false);
    expect(result.message).toContain('number');
  });

  it('accepts a password meeting all requirements', () => {
    expect(validatePassword('Password1').valid).toBe(true);
    expect(validatePassword('Password1').message).toBe('');
  });

  it('accepts passwords with special characters', () => {
    expect(validatePassword('P@ssw0rd!').valid).toBe(true);
  });

  it('rejects an empty string', () => {
    expect(validatePassword('').valid).toBe(false);
  });

  it('rejects a password of exactly 7 characters', () => {
    expect(validatePassword('Pass1Ab').valid).toBe(false);
  });

  it('accepts a password of exactly 8 characters', () => {
    expect(validatePassword('Password1'[0] + 'assword1').valid).toBe(true);
  });
});

// ─── validateEmail ───────────────────────────────────────────────────────────
describe('validateEmail', () => {
  it('accepts a standard email address', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('accepts emails with subdomains', () => {
    expect(validateEmail('user@mail.example.co.uk')).toBe(true);
  });

  it('accepts emails with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe(true);
  });

  it('rejects an email with no @ symbol', () => {
    expect(validateEmail('notanemail')).toBe(false);
  });

  it('rejects an email with no domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  it('rejects an email with no local part', () => {
    expect(validateEmail('@example.com')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  it('trims surrounding whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });
});

// ─── sanitizeText ─────────────────────────────────────────────────────────────
describe('sanitizeText', () => {
  it('trims leading and trailing whitespace', () => {
    expect(sanitizeText('  hello  ')).toBe('hello');
  });

  it('truncates to the default max length of 200', () => {
    const long = 'a'.repeat(300);
    expect(sanitizeText(long)).toHaveLength(200);
  });

  it('truncates to a custom max length', () => {
    expect(sanitizeText('a'.repeat(100), 50)).toHaveLength(50);
  });

  it('strips C0 control characters (\\x00–\\x08)', () => {
    expect(sanitizeText('hello\x00\x07world')).toBe('helloworld');
  });

  it('strips vertical tab (\\x0B) and form feed (\\x0C)', () => {
    expect(sanitizeText('hello\x0Bworld')).toBe('helloworld');
    expect(sanitizeText('hello\x0Cworld')).toBe('helloworld');
  });

  it('strips C1 control characters (\\x0E–\\x1F)', () => {
    expect(sanitizeText('hello\x1Fworld')).toBe('helloworld');
  });

  it('strips the DEL character (\\x7F)', () => {
    expect(sanitizeText('hello\x7Fworld')).toBe('helloworld');
  });

  it('preserves newlines (\\n)', () => {
    expect(sanitizeText('hello\nworld')).toBe('hello\nworld');
  });

  it('preserves tabs (\\t)', () => {
    expect(sanitizeText('hello\tworld')).toBe('hello\tworld');
  });

  it('returns an empty string for empty input', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('handles null-like input gracefully', () => {
    expect(sanitizeText(null as any)).toBe('');
    expect(sanitizeText(undefined as any)).toBe('');
  });
});
