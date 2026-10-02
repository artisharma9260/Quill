import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-mono text-8xl font-bold text-[#E7E5E4] mb-4">404</p>
        <h1 className="font-serif text-3xl font-bold text-[#1C1917] mb-3">Page not found</h1>
        <p className="text-[#78716C] font-sans mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
