import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const config = {
  matcher: ['/restricted-page', '/members-only'],
};

export async function middleware(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const token = req.cookies.get('supabase-auth-token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const { data: user, error } = await supabase.auth.getUser(token);
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}
