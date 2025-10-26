import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

export function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const course = useQuery(api.courses.get, { 
    courseId: courseId as Id<"courses"> 
  });
  const lessons = useQuery(api.lessons.listByCourse, { 
    courseId: courseId as Id<"courses"> 
  });

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to={`/category/${course.categoryId}`} className="text-blue-600 hover:text-blue-800">
          {course.category?.name}
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{course.title}</span>
      </nav>

      {/* Course Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
          <span className="text-sm text-gray-500">{course.estimatedHours} hours</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-lg text-gray-600 mb-6">{course.description}</p>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedLessons}/{lessons.length} lessons</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className="text-sm text-gray-500">{progressPercentage}% complete</span>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Lessons</h2>
        {lessons.map((lesson, index) => (
          <Link
            key={lesson._id}
            to={`/lesson/${lesson._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-4 flex items-center">
              <div className="flex-shrink-0 mr-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  lesson.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {lesson.completed ? '✓' : index + 1}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-gray-600">{lesson.description}</p>
              </div>
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
