import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export function Dashboard() {
  const categories = useQuery(api.categories.list);
  const userStats = useQuery(api.progress.getUserStats);
  const seedCategories = useMutation(api.categories.seedCategories);

  // Seed data on first load if no categories exist
  useEffect(() => {
    if (categories && categories.length === 0) {
      seedCategories();
    }
  }, [categories, seedCategories]);

  if (!categories) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to LearnHub</h1>
        <p className="text-xl text-gray-600">Choose a category to start your learning journey</p>
      </div>

      {/* Progress Stats */}
      {userStats && (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Progress</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{userStats.completedLessons}</div>
              <div className="text-gray-600">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{userStats.totalLessons}</div>
              <div className="text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{userStats.completionRate}%</div>
              <div className="text-gray-600">Completion Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}`}
            className="group"
          >
            <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow p-6 h-full">
              <div className={`w-16 h-16 ${category.color} rounded-lg flex items-center justify-center text-2xl text-white mb-4 group-hover:scale-105 transition-transform`}>
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
