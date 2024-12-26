import { clsx, type ClassValue } from 'clsx';
import { NextResponse } from 'next/server';
import { formatDate, formatDistanceToNowStrict } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sendResponse: ApiResponse = ({
  data = null,
  status = true,
  message,
  statusCode = 200,
  httpCode = 200,
}) => {
  return NextResponse.json(
    {
      data,
      message,
      status: statusCode,
      success: status,
    },
    {
      status: httpCode,
    }
  );
};

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();
  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, 'MMM d');
    } else {
      return formatDate(from, 'MMM d, yyyy');
    }
  }
}

export function formatNumber(n: number): string {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(n);
}
