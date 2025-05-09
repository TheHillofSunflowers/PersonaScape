// Generate metadata dynamically based on the username
export async function generateMetadata({ params }) {
  const username = params.username;
  
  return {
    title: `${username}'s PersonaScape`,
    description: `View ${username}'s public profile on PersonaScape`,
    openGraph: {
      title: `${username}'s PersonaScape`,
      description: `Check out ${username}'s public profile page`,
    },
  }
}

// Simplest possible layout component
export default function Layout({ children }) {
  return children;
} 