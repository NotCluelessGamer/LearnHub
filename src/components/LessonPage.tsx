import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useParams, Link } from "react-router-dom";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import anime from "animejs/lib/anime.es.js";

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = useQuery(api.lessons.get, { 
    lessonId: lessonId as Id<"lessons"> 
  });
  const markComplete = useMutation(api.lessons.markComplete);
  const markIncomplete = useMutation(api.lessons.markIncomplete);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const breadcrumbRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lesson) {
      // Breadcrumb animation
      anime({
        targets: breadcrumbRef.current,
        translateX: [-20, 0],
        opacity: [0, 1],
        duration: 600,
        easing: 'easeOutExpo'
      });

      // Content animation
      anime({
        targets: contentRef.current,
        translateY: [40, 0],
        opacity: [0, 1],
        duration: 800,
        delay: 200,
        easing: 'easeOutExpo'
      });

      // Animate content sections
      const sections = contentRef.current?.querySelectorAll('.content-section');
      if (sections) {
        anime({
          targets: sections,
          translateY: [30, 0],
          opacity: [0, 1],
          duration: 600,
          delay: anime.stagger(150, {start: 400}),
          easing: 'easeOutExpo'
        });
      }

      // Buttons animation
      anime({
        targets: buttonsRef.current?.children,
        scale: [0.8, 1],
        opacity: [0, 1],
        duration: 500,
        delay: anime.stagger(100, {start: 800}),
        easing: 'easeOutBack'
      });

      // Navigation animation
      anime({
        targets: navigationRef.current,
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 600,
        delay: 1000,
        easing: 'easeOutExpo'
      });
    }
  }, [lesson]);

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
        
        // Celebration animation
        anime({
          targets: '.completion-badge',
          scale: [1, 1.2, 1],
          rotate: [0, 10, -10, 0],
          duration: 600,
          easing: 'easeOutElastic(1, .8)'
        });
      }
    } catch (error) {
      toast.error("Failed to update progress");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetFeedback = async () => {
    const button = document.querySelector('.feedback-button');
    
    // Button loading animation
    anime({
      targets: button,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });

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

  const handleButtonHover = (e: React.MouseEvent<HTMLButtonElement>) => {
    anime({
      targets: e.currentTarget,
      scale: [1, 1.05],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    anime({
      targets: e.currentTarget,
      scale: [1.05, 1],
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <nav ref={breadcrumbRef} className="mb-6 opacity-0">
        <Link to="/" className="text-blue-600 hover:text-blue-800 transition-colors">Dashboard</Link>
        <span className="mx-2 text-gray-500">/</span>
        <Link to={`/course/${lesson.courseId}`} className="text-blue-600 hover:text-blue-800 transition-colors">
          {lesson.course?.title}
        </Link>
        <span className="mx-2 text-gray-500">/</span>
        <span className="text-gray-900">{lesson.title}</span>
      </nav>

      {/* Lesson Content */}
      <div ref={contentRef} className="bg-white rounded-lg shadow-sm border p-8 mb-6 opacity-0">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
          <div className={`completion-badge px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
            lesson.completed 
              ? 'bg-green-100 text-green-800 shadow-md' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {lesson.completed ? '✓ Completed' : 'In Progress'}
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-8 leading-relaxed">{lesson.description}</p>

        {/* Lesson Content */}
        <div className="content-section mb-8 opacity-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">📚</span>
            Lesson Content
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-500">
            <p className="text-gray-700 leading-relaxed">{lesson.content}</p>
          </div>
        </div>

        {/* Task Section */}
        <div className="content-section mb-8 opacity-0">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">🎯</span>
            Your Task
          </h2>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed">{lesson.task}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleToggleComplete}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:shadow-lg ${
              lesson.completed
                ? 'bg-gray-500 hover:bg-gray-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed opacity-0`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : (
              lesson.completed ? 'Mark Incomplete' : 'Mark Complete'
            )}
          </button>
          
          <button
            onClick={handleGetFeedback}
            onMouseEnter={handleButtonHover}
            onMouseLeave={handleButtonLeave}
            className="feedback-button px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-all duration-300 transform hover:shadow-lg opacity-0"
          >
            <span className="flex items-center">
              <span className="mr-2">🤖</span>
              Get AI Feedback
            </span>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div ref={navigationRef} className="flex justify-between opacity-0">
        <Link
          to={`/course/${lesson.courseId}`}
          className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center"
        >
          <span className="mr-2">←</span>
          Back to Course
        </Link>
      </div>
    </div>
  );
}
