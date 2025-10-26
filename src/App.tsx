import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CategoryPage } from "./components/CategoryPage";
import { CoursePage } from "./components/CoursePage";
import { LessonPage } from "./components/LessonPage";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export default function App() {
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Header animation on load
    anime({
      targets: headerRef.current,
      translateY: [-20, 0],
      opacity: [0, 1],
      duration: 800,
      easing: 'easeOutExpo'
    });
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
        <header ref={headerRef} className="sticky top-0 z-10 bg-white/90 backdrop-blur-md h-16 flex justify-between items-center border-b shadow-sm px-4 opacity-0">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LearnHub
          </h2>
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </header>
        <main className="flex-1">
          <Content />
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.5rem',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            },
          }}
        />
      </div>
    </Router>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loggedInUser !== undefined) {
      anime({
        targets: contentRef.current,
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
      });
    }
  }, [loggedInUser]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <div className="absolute inset-0 animate-ping rounded-full h-12 w-12 border-2 border-blue-300 opacity-20"></div>
        </div>
      </div>
    );
  }

  return (
    <div ref={contentRef} className="flex flex-col opacity-0">
      <Authenticated>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </Authenticated>
      
      <Unauthenticated>
        <div className="flex items-center justify-center min-h-[400px] p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Welcome to LearnHub
              </h1>
              <p className="text-xl text-gray-600">Sign in to start your learning journey</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg border p-8">
              <SignInForm />
            </div>
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
