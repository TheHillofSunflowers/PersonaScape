import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

type Props = {
  params: { username: string }
  children: React.ReactNode
}

// Generate metadata dynamically based on the username
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Make sure params is treated as a promise and awaited
  const resolvedParams = await Promise.resolve(params);
  const username = resolvedParams.username;
  
  // You could fetch profile data here to get more details
  // but for simplicity we'll just use the username
  
  return {
    title: `${username}'s PersonaScape`,
    description: `View ${username}'s public profile on PersonaScape`,
    openGraph: {
      title: `${username}'s PersonaScape`,
      description: `Check out ${username}'s public profile page`,
    },
  }
}

export default function ProfileLayout({ 
  children,
  params
}: Props) {
  return (
    <>
      {children}
    </>
  )
} 