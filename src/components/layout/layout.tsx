// src/components/Layout.tsx
import { Link, Outlet } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { PlusCircle, List } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">Survey Builder</Link>
          <nav className="flex gap-4">
            <Button variant="outline" asChild>
              <Link to="/">
                <List className="h-4 w-4 mr-2" />
                My Surveys
              </Link>
            </Button>
            <Button asChild>
              <Link to="/builder">
                <PlusCircle className="h-4 w-4 mr-2" />
                Create Survey
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
      <footer className="border-t py-4">
        <div className="container mx-auto text-center text-gray-500">
          Survey Builder - Built with React, Tailwind, shadcn/ui and Supabase
        </div>
      </footer>
    </div>
  );
}