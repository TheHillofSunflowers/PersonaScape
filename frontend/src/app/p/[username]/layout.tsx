import type { Metadata } from 'next';

type GenerateMetadataProps = {
  params: { username: string }
}

// Generate metadata dynamically based on the username
export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
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

type LayoutProps = {
  children: React.ReactNode;
  params: { username: string };
}

export default function ProfileLayout({ 
  children,
  params 
}: LayoutProps) {
  return (
    <>
      {children}
    </>
  )
} 