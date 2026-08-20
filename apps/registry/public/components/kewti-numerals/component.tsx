import React from 'react';

// Ge'ez numeral symbols
const ONES: Record<number, string> = {
  1: '፩',
  2: '፪',
  3: '፫',
  4: '፬',
  5: '፭',
  6: '፮',
  7: '፯',
  8: '፰',
  9: '፱',
};

const TENS: Record<number, string> = {
  10: '፲',
  20: '፳',
  30: '፴',
  40: '፵',
  50: '፶',
  60: '፷',
  70: '፸',
  80: '፹',
  90: '፺',
};

/**
 * Converts a positive integer into its Ge'ez numeral string representation.
 */
export function toGeez(num: number): string {
  if (num === 0) return '0'; // Traditional Ge'ez numeral system has no zero symbol
  if (num < 0) return `-${toGeez(Math.abs(num))}`;

  let result = '';
  // Split number into groups of 2 digits (powers of 100) from right to left
  const groups: number[] = [];
  let temp = Math.floor(num);

  while (temp > 0) {
    groups.push(temp % 100);
    temp = Math.floor(temp / 100);
  }

  for (let i = groups.length - 1; i >= 0; i--) {
    const groupVal = groups[i] ?? 0;
    const tens = Math.floor(groupVal / 10) * 10;
    const ones = groupVal % 10;

    let groupStr = '';
    if (tens > 0) groupStr += TENS[tens];
    if (ones > 0) groupStr += ONES[ones];

    // Omit '፩' (1) before ፻ (100) or ፼ (10,000) if it's the leading digit
    if (groupStr === '፩' && i > 0 && i === groups.length - 1) {
      groupStr = '';
    }

    if (groupVal > 0 || i === 0) {
      result += groupStr;
    }

    // Append 100 (፻) or 10,000 (፼) separators for higher powers
    if (i > 0) {
      result += i % 2 === 1 ? '፻' : '፼';
    }
  }

  return result;
}

export interface GeezNumberProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The numerical value to display */
  value: number;
  /** The numeral system to format the number in */
  system?: 'geez' | 'arabic';
  /** Optional locale formatting for Arabic numerals (default: en-US) */
  locale?: string;
}

export const KewtiNumerals: React.FC<GeezNumberProps> = ({
  value,
  system = 'geez',
  locale = 'en-US',
  className,
  ...rest
}) => {
  const formattedValue =
    system === 'geez'
      ? toGeez(value)
      : value.toLocaleString(locale);

  return (
    <span className={className} {...rest}>
      {formattedValue}
    </span>
  );
};
