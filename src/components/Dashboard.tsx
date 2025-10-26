import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export function Dashboard() {
  const categories = useQuery(api.categories.list);
  const userStats = useQuery(api.progress.getUserStats);
  const seedCategories = useMutation(api.categories.seedCategories);
  
  const welcomeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Seed data on first load if no categories exist
  useEffect(() => {
    if (categories && categories.length === 0) {
      seedCategories();
    }
  }, [categories, seedCategories]);

  // Animate elements when they load
  useEffect(() => {
    if (categories && categories.length > 0) {
      // Welcome section animation
      anime({
        targets: welcomeRef.current,
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutExpo'
      });

      // Stats animation
      if (userStats && statsRef.current) {
        anime({
          targets: statsRef.current,
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 800,
          delay: 200,
          easing: 'easeOutExpo'
        });

        // Animate stat numbers
        anime({
          targets: statsRef.current.querySelectorAll('.stat-number'),
          scale: [0.8, 1],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(100, {start: 400}),
          easing: 'easeOutBack'
        });
      }

      // Categories grid animation
      anime({
        targets: categoriesRef.current?.children,
        translateY: [50, 0],
        opacity: [0, 1],
        scale: [0.9, 1],
        duration: 600,
        delay: anime.stagger(100, {start: 300}),
        easing: 'easeOutExpo'
      });
    }
  }, [categories, userStats]);

  if (!categories) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleCategoryHover = (e: React.MouseEvent<HTMLElement>) => {
    const icon = e.currentTarget.querySelector('.category-icon');
    anime({
      targets: icon,
      scale: [1, 1.1],
      rotate: [0, 5],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };

  const handleCategoryLeave = (e: React.MouseEvent<HTMLElement>) => {
    const icon = e.currentTarget.querySelector('.category-icon');
    anime({
      targets: icon,
      scale: [1.1, 1],
      rotate: [5, 0],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div ref={welcomeRef} className="mb-8 opacity-0">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LearnHub</h1>
        <p className="text-xl text-gray-600">Choose a category to start your learning journey</p>
      </div>

      {/* Progress Stats */}
      {userStats && (
        <div ref={statsRef} className="bg-white rounded-lg shadow-sm border p-6 mb-8 opacity-0">
          <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-blue-600">{userStats.completedLessons}</div>
              <div className="text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-green-600">{userStats.totalLessons}</div>
              <div className="text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="stat-number text-3xl font-bold text-purple-600">{userStats.completionRate}%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div ref={categoriesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="group"
            onMouseEnter={handleCategoryHover}
            onMouseLeave={handleCategoryLeave}
          >
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 p-6 h-full transform hover:-translate-y-1">
              <div className={`category-icon w-16 h-16 ${category.color} rounded-lg flex items-center justify-center text-2xl text-white mb-4 transition-all duration-300`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {category.name}
              </h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
