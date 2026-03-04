import { NextRequest, NextResponse } from 'next/server';
import { profile } from '@/data/profile';

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeField(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function buildMailtoUrl({ name, email, subject, message }: ContactPayload): string {
  const params = new URLSearchParams({
    subject: `Portfolio Inquiry: ${subject}`,
    body: [`Name: ${name}`, `Email: ${email}`, '', message].join('\n'),
  });

  return `mailto:${profile.email}?${params.toString()}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const submission: ContactPayload = {
      name: normalizeField(body?.name),
      email: normalizeField(body?.email),
      subject: normalizeField(body?.subject),
      message: normalizeField(body?.message),
    };

    if (!submission.name || !submission.email || !submission.subject || !submission.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!emailPattern.test(submission.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      status: 'handoff',
      message: `Your email app should open with this message pre-filled. If nothing opens, email me directly at ${profile.email}.`,
      fallbackUrl: buildMailtoUrl(submission),
    });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
