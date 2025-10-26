import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useState } from "react";
import { toast } from "sonner";

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = useQuery(api.lessons.get, { 
    lessonId: lessonId as Id<"lessons"> 
  });
  const markComplete = useMutation(api.lessons.markComplete);
  const markIncomplete = useMutation(api.lessons.markIncomplete);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!lesson) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleToggleComplete = async () => {
    setIsSubmitting(true);
    try {
      if (lesson.completed) {
        await markIncomplete({ lessonId: lesson._id });
        toast.success("Lesson marked as incomplete");
      } else {
        await markComplete({ lessonId: lesson._id });
        toast.success("Lesson completed! Great job! 🎉");
      }
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetFeedback = async () => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId: lesson._id, task: lesson.task })
      });
      const data = await response.json();
      toast.success(data.feedback);
    } catch (error) {
      toast.error("Feedback service temporarily unavailable");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to={`/course/${lesson.courseId}`} className="text-blue-600 hover:text-blue-800">
          {lesson.course?.title}
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{lesson.title}</span>
      </nav>

      {/* Lesson Content */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            lesson.completed 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {lesson.completed ? 'Completed' : 'In Progress'}
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8">{lesson.description}</p>

        {/* Lesson Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Lesson Content</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-700 leading-relaxed">{lesson.content}</p>
          </div>
        </div>

        {/* Task Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Task</h2>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">{lesson.task}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleToggleComplete}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              lesson.completed
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Updating...' : lesson.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          
          <button
            onClick={handleGetFeedback}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
          >
            Get AI Feedback
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link
          to={`/course/${lesson.courseId}`}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          ← Back to Course
        </Link>
      </div>
    </div>
  );
}
