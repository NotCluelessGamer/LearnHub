import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const courses = useQuery(api.courses.listByCategory, { 
    categoryId: categoryId as Id<"categories"> 
  });
  const categories = useQuery(api.categories.list);
  
  const headerRef = useRef<HTMLDivElement>(null);
  const coursesRef = useRef<HTMLDivElement>(null);
  const breadcrumbRef = useRef<HTMLElement>(null);
  
  const category = categories?.find(c => c._id === categoryId);

  useEffect(() => {
    if (courses && category) {
      // Breadcrumb animation
      anime({
        targets: breadcrumbRef.current,
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
      });

      // Header animation
      anime({
        targets: headerRef.current,
        translateY: [-40, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
      });

      // Category icon animation
      anime({
        targets: headerRef.current?.querySelector('.category-header-icon'),
        scale: [0, 1],
        rotate: [180, 0],
        duration: 800,
        delay: 400,
        easing: 'easeOutBack'
      });

      // Courses grid animation
      anime({
        targets: coursesRef.current?.children,
        translateY: [60, 0],
        opacity: [0, 1],
        scale: [0.8, 1],
        duration: 700,
        delay: anime.stagger(120, {start: 500}),
        easing: 'easeOutExpo'
      });
    }
  }, [courses, category]);

  if (!courses || !category) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleCourseHover = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget.querySelector('.course-card');
    const badge = e.currentTarget.querySelector('.difficulty-badge');
    
    anime({
      targets: card,
      scale: [1, 1.02],
      translateY: [0, -5],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: badge,
      scale: [1, 1.05],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  const handleCourseLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget.querySelector('.course-card');
    const badge = e.currentTarget.querySelector('.difficulty-badge');
    
    anime({
      targets: card,
      scale: [1.02, 1],
      translateY: [-5, 0],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: badge,
      scale: [1.05, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav ref={breadcrumbRef} className="mb-6 opacity-0">
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div ref={headerRef} className="mb-8 opacity-0">
        <div className="flex items-center mb-4">
          <div className={`category-header-icon w-16 h-16 ${category.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-xl text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div ref={coursesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/course/${course._id}`}
            className="group"
            onMouseEnter={handleCourseHover}
            onMouseLeave={handleCourseLeave}
          >
            <div className="course-card bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 p-6 h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`difficulty-badge px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)} transition-all duration-200`}>
                  {course.difficulty}
                </span>
                <span className="text-sm text-gray-500 font-medium">{course.estimatedHours}h</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                {course.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
