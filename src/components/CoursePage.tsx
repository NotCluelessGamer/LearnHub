import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useEffect, useRef } from "react";
import anime from "animejs/lib/anime.es.js";

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = useQuery(api.courses.get, { 
    courseId: courseId as Id<"courses"> 
  });
  const lessons = useQuery(api.lessons.listByCourse, { 
    courseId: courseId as Id<"courses"> 
  });

  const breadcrumbRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const lessonsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (course && lessons) {
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
        translateY: [-30, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
      });

      // Progress bar animation
      const completedLessons = lessons.filter(lesson => lesson.completed).length;
      const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;
      
      anime({
        targets: progressBarRef.current?.querySelector('.progress-fill'),
        width: [`0%`, `${progressPercentage}%`],
        duration: 1200,
        delay: 600,
        easing: 'easeOutExpo'
      });

      // Lessons animation
      anime({
        targets: lessonsRef.current?.children,
        translateX: [-40, 0],
        opacity: [0, 1],
        duration: 600,
        delay: anime.stagger(80, {start: 800}),
        easing: 'easeOutExpo'
      });
    }
  }, [course, lessons]);

  if (!course || !lessons) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const completedLessons = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessons / lessons.length) * 100) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleLessonHover = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget.querySelector('.lesson-card');
    const arrow = e.currentTarget.querySelector('.lesson-arrow');
    const checkmark = e.currentTarget.querySelector('.lesson-checkmark');
    
    anime({
      targets: card,
      scale: [1, 1.01],
      translateX: [0, 5],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: arrow,
      translateX: [0, 5],
      duration: 200,
      easing: 'easeOutQuad'
    });

    if (checkmark) {
      anime({
        targets: checkmark,
        scale: [1, 1.1],
        rotate: [0, 10],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  };

  const handleLessonLeave = (e: React.MouseEvent<HTMLElement>) => {
    const card = e.currentTarget.querySelector('.lesson-card');
    const arrow = e.currentTarget.querySelector('.lesson-arrow');
    const checkmark = e.currentTarget.querySelector('.lesson-checkmark');
    
    anime({
      targets: card,
      scale: [1.01, 1],
      translateX: [5, 0],
      duration: 300,
      easing: 'easeOutQuad'
    });

    anime({
      targets: arrow,
      translateX: [5, 0],
      duration: 200,
      easing: 'easeOutQuad'
    });

    if (checkmark) {
      anime({
        targets: checkmark,
        scale: [1.1, 1],
        rotate: [10, 0],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav ref={breadcrumbRef} className="mb-6 opacity-0">
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to={`/category/${course.categoryId}`} className="text-blue-600 hover:text-blue-800 transition-colors">
          {course.category?.name}
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div ref={headerRef} className="bg-white rounded-lg shadow-sm border p-6 mb-8 opacity-0">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="text-sm text-gray-500 font-medium">{course.estimatedHours} hours</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{course.description}</p>
        
        {/* Progress Bar */}
        <div ref={progressBarRef} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedLessons}/{lessons.length} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="progress-fill bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: '0%' }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className="text-sm text-gray-500 font-medium">{progressPercentage}% complete</span>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lessons</h2>
        <div ref={lessonsRef}>
          {lessons.map((lesson, index) => (
            <Link
              key={lesson._id}
              to={`/lesson/${lesson._id}`}
              className="group block opacity-0"
              onMouseEnter={handleLessonHover}
              onMouseLeave={handleLessonLeave}
            >
              <div className="lesson-card bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-300 p-4 flex items-center">
                <div className="flex-shrink-0 mr-4">
                  <div className={`lesson-checkmark w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    lesson.completed 
                      ? 'bg-green-500 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {lesson.completed ? '✓' : index + 1}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {lesson.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <svg className="lesson-arrow w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
