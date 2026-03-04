import { NextRequest, NextResponse } from 'next/server';
import { profile } from '@/data/profile';

export async function GET(request: NextRequest) {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  const baseUrl = (configuredBaseUrl || request.nextUrl.origin).replace(/\/$/, '');

  return NextResponse.json({
    message: 'PDF Generation',
    instructions: [
      '1. Visit the print-friendly version of the resume',
      '2. Use your browser\'s Print function (Ctrl/Cmd + P)',
      '3. Select "Save as PDF" as the destination',
      '4. Click Save to download your PDF resume',
    ],
    printUrl: `${baseUrl}/print`,
    filename: `${profile.name.replace(/\s+/g, '_')}_Resume.pdf`,
  });
}
