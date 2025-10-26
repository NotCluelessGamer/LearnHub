import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("categories").collect();
  },
});

export const seedCategories = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if categories already exist
    const existing = await ctx.db.query("categories").first();
    if (existing) return;

    // Create categories
    const webDevId = await ctx.db.insert("categories", {
      name: "Web Development",
      description: "Learn to build modern websites and web applications",
      icon: "💻",
      color: "bg-blue-500",
    });

    const cybersecurityId = await ctx.db.insert("categories", {
      name: "Cybersecurity",
      description: "Master security fundamentals and ethical hacking",
      icon: "🔒",
      color: "bg-red-500",
    });

    const languagesId = await ctx.db.insert("categories", {
      name: "Languages",
      description: "Learn new languages through practical conversation",
      icon: "🌍",
      color: "bg-green-500",
    });

    // Create Web Development courses
    const htmlCourseId = await ctx.db.insert("courses", {
      categoryId: webDevId,
      title: "Intro to Web Development",
      description: "Learn HTML, CSS, and how websites work",
      difficulty: "Beginner",
      estimatedHours: 8,
    });

    const reactCourseId = await ctx.db.insert("courses", {
      categoryId: webDevId,
      title: "Learn React by Building a To-Do App",
      description: "Hands-on project with components and state",
      difficulty: "Intermediate",
      estimatedHours: 12,
    });

    const tailwindCourseId = await ctx.db.insert("courses", {
      categoryId: webDevId,
      title: "Master Tailwind CSS through Projects",
      description: "Style real layouts using Tailwind",
      difficulty: "Intermediate",
      estimatedHours: 6,
    });

    // Create Cybersecurity courses
    const cyberHygieneCourseId = await ctx.db.insert("courses", {
      categoryId: cybersecurityId,
      title: "Basics of Cyber Hygiene",
      description: "Secure passwords, phishing awareness, and privacy",
      difficulty: "Beginner",
      estimatedHours: 4,
    });

    const ethicalHackingCourseId = await ctx.db.insert("courses", {
      categoryId: cybersecurityId,
      title: "Intro to Ethical Hacking",
      description: "Basic penetration testing concepts",
      difficulty: "Advanced",
      estimatedHours: 16,
    });

    const networkSecurityCourseId = await ctx.db.insert("courses", {
      categoryId: cybersecurityId,
      title: "Network Security for Beginners",
      description: "Understand firewalls, IPs, and packet sniffing",
      difficulty: "Intermediate",
      estimatedHours: 10,
    });

    // Create Language courses
    const spanishCourseId = await ctx.db.insert("courses", {
      categoryId: languagesId,
      title: "Learn Spanish by Speaking",
      description: "Common phrases with pronunciation practice",
      difficulty: "Beginner",
      estimatedHours: 20,
    });

    const englishCourseId = await ctx.db.insert("courses", {
      categoryId: languagesId,
      title: "English Practice for Everyday Use",
      description: "Conversational tasks",
      difficulty: "Intermediate",
      estimatedHours: 15,
    });

    const japaneseCourseId = await ctx.db.insert("courses", {
      categoryId: languagesId,
      title: "Intro to Japanese with Real Phrases",
      description: "Learn practical Japanese through examples",
      difficulty: "Beginner",
      estimatedHours: 25,
    });

    // Create lessons for HTML course
    await ctx.db.insert("lessons", {
      courseId: htmlCourseId,
      title: "What is HTML?",
      description: "Understanding the structure of web pages",
      content: "HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure of a web page using elements and tags.",
      task: "Create a simple HTML page with a heading, paragraph, and list. Include proper DOCTYPE and basic structure.",
      order: 1,
    });

    await ctx.db.insert("lessons", {
      courseId: htmlCourseId,
      title: "CSS Fundamentals",
      description: "Styling your HTML with CSS",
      content: "CSS (Cascading Style Sheets) is used to style HTML elements. You can change colors, fonts, layouts, and more.",
      task: "Style your HTML page from the previous lesson. Add colors, change fonts, and create a simple layout.",
      order: 2,
    });

    await ctx.db.insert("lessons", {
      courseId: htmlCourseId,
      title: "Making it Interactive",
      description: "Adding basic JavaScript functionality",
      content: "JavaScript adds interactivity to web pages. You can respond to user clicks, validate forms, and create dynamic content.",
      task: "Add a button to your page that changes the background color when clicked using JavaScript.",
      order: 3,
    });

    // Create lessons for React course
    await ctx.db.insert("lessons", {
      courseId: reactCourseId,
      title: "React Components Basics",
      description: "Understanding components and JSX",
      content: "React components are reusable pieces of UI. They can be functions or classes that return JSX (JavaScript XML).",
      task: "Create a TodoItem component that displays a task with a checkbox and delete button.",
      order: 1,
    });

    await ctx.db.insert("lessons", {
      courseId: reactCourseId,
      title: "State Management with useState",
      description: "Managing component state",
      content: "The useState hook allows you to add state to functional components. State changes trigger re-renders.",
      task: "Add state to track a list of todos and implement add/remove functionality.",
      order: 2,
    });

    // Create lessons for Spanish course
    await ctx.db.insert("lessons", {
      courseId: spanishCourseId,
      title: "Basic Greetings",
      description: "Essential Spanish greetings and introductions",
      content: "Learn common Spanish greetings: Hola (Hello), Buenos días (Good morning), Buenas tardes (Good afternoon), ¿Cómo estás? (How are you?)",
      task: "Practice introducing yourself in Spanish. Record yourself saying 'Hola, me llamo [your name]. ¿Cómo estás?'",
      order: 1,
    });

    await ctx.db.insert("lessons", {
      courseId: spanishCourseId,
      title: "Numbers and Time",
      description: "Counting and telling time in Spanish",
      content: "Learn numbers 1-20 and basic time expressions: uno, dos, tres... ¿Qué hora es? (What time is it?)",
      task: "Practice telling the current time in Spanish and count from 1 to 20 out loud.",
      order: 2,
    });

    // Create lessons for Cyber Hygiene course
    await ctx.db.insert("lessons", {
      courseId: cyberHygieneCourseId,
      title: "Password Security",
      description: "Creating and managing strong passwords",
      content: "Strong passwords should be at least 12 characters long, include mixed case letters, numbers, and symbols. Use unique passwords for each account.",
      task: "Audit your current passwords and create a plan to update weak ones. Set up a password manager if you don't have one.",
      order: 1,
    });

    await ctx.db.insert("lessons", {
      courseId: cyberHygieneCourseId,
      title: "Recognizing Phishing",
      description: "Identifying and avoiding phishing attacks",
      content: "Phishing emails try to steal your credentials by impersonating legitimate services. Look for suspicious URLs, urgent language, and requests for sensitive information.",
      task: "Review your recent emails and identify any potential phishing attempts. Practice checking email headers and URLs.",
      order: 2,
    });

    return "Seed data created successfully!";
  },
});
