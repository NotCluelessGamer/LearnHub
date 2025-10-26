import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";

export function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const courses = useQuery(api.courses.listByCategory, { 
    categoryId: categoryId as Id<"categories"> 
  });
  const categories = useQuery(api.categories.list);
  
  const category = categories?.find(c => c._id === categoryId);

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

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center text-2xl text-white mr-4`}>
            {category.icon}
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{category.name}</h1>
            <p className="text-xl text-gray-600">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link
            key={course._id}
            to={`/course/${course._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 h-full">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className="text-sm text-gray-500">{course.estimatedHours}h</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {course.title}
              </h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
