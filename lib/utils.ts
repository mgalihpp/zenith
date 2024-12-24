import { clsx, type ClassValue } from 'clsx';
import { NextResponse } from 'next/server';
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
