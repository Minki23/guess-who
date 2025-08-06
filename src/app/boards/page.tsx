import { createClient } from '@/utils/supabase/server';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { stat } from 'fs';
import ImageSearch from '@/components/ImageSearch';

export default async function Notes() {

  const session = await auth();

  if (!session) {
    redirect('/');
  }

  return(
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Boards</h1>
      <p className="text-lg">You are logged in as {session.user?.email}</p>
      <ImageSearch />
      <img src={session.user?.image || ""} alt="User Avatar" className="rounded-full w-24 h-24" />
    </div>
  )
}