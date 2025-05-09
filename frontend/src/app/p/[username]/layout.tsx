import type { Metadata } from 'next';

// Generate metadata dynamically based on the username
export async function generateMetadata({ 
  params 
}: { 
  params: { username: string }
}): Promise<Metadata> {
  const username = params.username;
  
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
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  )
} 