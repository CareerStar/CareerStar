import React, { useState } from 'react';
import { Star, User, ChevronRight, Award, Code, CheckCircle, TrendingUp, Users, Lightbulb } from 'lucide-react';

// Exported data so other components (e.g., Profile) can consume the same hardcoded info
export const cohortAllInterns = [
    { name: "Karen", stars: 124, reports: 5, manager: "Clara Fletcher" },
    { name: "Yuzhen", stars: 115, reports: 3, manager: "null" },
    { name: "Savara khan", stars: 104, reports: 5, manager: "Melinda Rushing" },
    { name: "Angie", stars: 103, reports: 6, manager: "Clara Fletcher" },
    { name: "Abdulbari", stars: 77, reports: 5, manager: "Clara Fletcher" },
    { name: "Yassine", stars: 73, reports: 6, manager: "Cam Flowers" },
    { name: "jade Acevedo", stars: 72, reports: 2, manager: "Melinda Rushing" },
    { name: "Judah", stars: 63, reports: 1, manager: "null" },
    { name: "Rudgino", stars: 54, reports: 1, manager: "Justin Andrew" },
    { name: "Kyshawn", stars: 53, reports: 3, manager: "null" },
    { name: "Jasmine", stars: 36, reports: 4, manager: "Reneta Lansiquot-Panagiotakis" },
    { name: "Dante", stars: 33, reports: 2, manager: "Sandra Soueid" },
    { name: "Asmar", stars: 33, reports: 2, manager: "Erica Krutu Davies" },
    { name: "Mohamed", stars: 13, reports: 1, manager: "Allia Mohamed" },
    { name: "Solea Miller", stars: 13, reports: 1, manager: "Erica Davies" },
    { name: "Aka", stars: 13, reports: 1, manager: "Joshua" },
    { name: "Donald", stars: 13, reports: 1, manager: "Cameron Flowers" }
];

export const getCohortInternDetails = (internName) => {
  const details = {
      'Angie': {
        highlights: [
          "Went to company recruiting event with team, gave interview tips and received valuable feedback for app development",
          "Completed comprehensive card design (front and back) for Career Star presentation materials",
          "Worked extensively on card design implementation, successfully testing Figma designs in local development environment",
          "Received positive feedback from coworkers and actively collaborated on design improvements"
        ],
        technologies: [
          { name: "Figma", count: 8 },
          { name: "Design", count: 6 },
          { name: "CSS", count: 4 },
          { name: "HTML", count: 3 }
        ]
      },
      'Yassine': {
        highlights: [
          "Adjusted user database architecture to better support search functionality and troubleshooted data type errors",
          "Performed comprehensive competitive analysis on UI/UX for AMS solutions and presented findings to team",
          "Researched and evaluated component libraries for frontend revision, presenting competitive analysis results",
          "Successfully installed and configured i18n internationalization, integrating translation functions into components"
        ],
        technologies: [
          { name: "Database", count: 9 },
          { name: "UI/UX", count: 7 },
          { name: "JavaScript", count: 5 },
          { name: "React", count: 4 }
        ]
      },
      'Karen': {
        highlights: [
          "Created two different interactive activities for the Career Star website, enhancing user engagement",
          "Successfully pushed local development changes to live website, implementing major UI improvements",
          "Delivered presentation to cohort of 20+ students, showcasing project work and technical achievements",
          "Collaborated with team at City Tech to discuss final weeks of internship and project completion strategies"
        ],
        technologies: [
          { name: "React", count: 8 },
          { name: "JavaScript", count: 6 },
          { name: "Web Development", count: 4 },
          { name: "Git", count: 3 }
        ]
      },
      'Abdulbari': {
        highlights: [
          "Fixed critical timezone bug converting UTC timestamps to EST display, improving user report accuracy",
          "Added 'My Reports' feature to profile page enabling users to view their personal report history",
          "Created database schema for Activity 15 to save user internship information upon completion",
          "Presented CareerStar platform to Cohort 2, delivering comprehensive overview to 20+ students"
        ],
        technologies: [
          { name: "JavaScript", count: 7 },
          { name: "Database", count: 5 },
          { name: "React", count: 4 },
          { name: "SQL", count: 3 }
        ]
      },
      'Savara khan': {
        highlights: [
          "Completed 95% of clinical PDF-to-JSON conversions, nearly finishing the complete dataset transformation",
          "Successfully uploaded all finalized JSON files to MongoDB for streamlined data storage and management",
          "Conducted exploratory data analysis (EDA) on JSON patient reports and developed severity score modeling",
          "Expanded clinical data coverage by adding more PDFs to MongoDB and enhancing medical terminology word bank"
        ],
        technologies: [
          { name: "MongoDB", count: 8 },
          { name: "Python", count: 6 },
          { name: "JSON", count: 5 },
          { name: "Data Analysis", count: 4 }
        ]
      },
      'Jasmine': {
        highlights: [
          "Conducted comprehensive research and testing of 2D Unity for game interactions, level design, and UI development",
          "Validated technical documentation through testing with multiple team members and incorporated feedback",
          "Transitioned from 2D to 3D Unity development, researching asset store components and implementation methods",
          "Developed user interface panels for 3D Unity including dialogue box systems and interactive elements"
        ],
        technologies: [
          { name: "Unity", count: 10 },
          { name: "C#", count: 7 },
          { name: "Game Development", count: 5 },
          { name: "3D Modeling", count: 3 }
        ]
      },
      'Dante': {
        highlights: [
          "Created secondary application for different user groups, expanding platform accessibility and functionality",
          "Improved booking system enabling appointment viewing for both clients and professionals based on user ID matching",
          "Implemented enhanced navigation with additional tabs for improved user experience in secondary app",
          "Developed accurate appointment availability system making already booked time slots unselectable"
        ],
        technologies: [
          { name: "React", count: 6 },
          { name: "Database", count: 5 },
          { name: "JavaScript", count: 4 },
          { name: "API", count: 3 }
        ]
      },
      'Rudgino': {
        highlights: [
          "Designed and built responsive landing page from scratch with clean layout and modern branding",
          "Implemented custom navigation bar with smooth scroll behavior and mobile responsiveness",
          "Created fully responsive Hero section with custom-coded design aligned to company vision",
          "Refined page performance through code optimization and improved cross-viewport layout consistency"
        ],
        technologies: [
          { name: "HTML", count: 8 },
          { name: "CSS", count: 7 },
          { name: "JavaScript", count: 5 },
          { name: "Responsive Design", count: 4 }
        ]
      },
      'Mohamed': {
        highlights: [
          "Built robust keyword-matching logic for property features using mapped synonym lists, improving accuracy",
          "Enhanced advice-field logic to penalize overly positive reviews when pros/cons show red flags",
          "Created Selenium-based web scraping scripts for multiple NYC property sites extracting listings data",
          "Improved review pipeline input handling with validation steps to ensure model stability during training"
        ],
        technologies: [
          { name: "Python", count: 8 },
          { name: "Selenium", count: 6 },
          { name: "Web Scraping", count: 5 },
          { name: "Machine Learning", count: 4 }
        ]
      },
      'Kyshawn': {
        highlights: [
          "Made significant progress converting JSX files to TypeScript (TSX) while maintaining code functionality",
          "Successfully linked Take Attendance feature with Class Management system for improved integration",
          "Collaborated with team on backend development, working on different API routes after establishing connection",
          "Started full team sprint on ArcAttend project, contributing to both frontend and backend development"
        ],
        technologies: [
          { name: "TypeScript", count: 7 },
          { name: "React", count: 5 },
          { name: "Node.js", count: 4 },
          { name: "API Development", count: 3 }
        ]
      },
      'jade Acevedo': {
        highlights: [
          "Completed 100% of clinical data digitization, successfully converting all PDFs to structured JSON format",
          "Successfully uploaded finalized JSON records to MongoDB for efficient data management and query capabilities",
          "Cleaned and structured over 40 clinical records, preparing comprehensive dataset for analysis",
          "Conducted exploratory data analysis (EDA) to identify key features for future analytical modeling"
        ],
        technologies: [
          { name: "MongoDB", count: 6 },
          { name: "Python", count: 5 },
          { name: "JSON", count: 4 },
          { name: "Data Processing", count: 3 }
        ]
      },
      'Yuzhen': {
        highlights: [
          "Completed three critical tickets before Tubular Lab Viewpoint service launch, including header functionality",
          "Developed header function for property/creator selection and display with team collaboration",
          "Worked on creator uniqueness ticket for legacy application, updating data validation systems",
          "Successfully completed two debug tickets improving header section functionality of the product"
        ],
        technologies: [
          { name: "JavaScript", count: 6 },
          { name: "React", count: 4 },
          { name: "API", count: 3 },
          { name: "Git", count: 2 }
        ]
      },
      'Solea Miller': {
        highlights: [
          "Created comprehensive website in Squarespace for organization with full functionality",
          "Developed 19 blog postings for website content, establishing strong online presence",
          "Digitized 104 pages of company contacts, improving data accessibility and organization",
          "Successfully launched complete digital platform for organizational communications"
        ],
        technologies: [
          { name: "Squarespace", count: 6 },
          { name: "Content Creation", count: 5 },
          { name: "Digital Marketing", count: 3 },
          { name: "Data Entry", count: 2 }
        ]
      },
      'Aka': {
        highlights: [
          "Replaced direct user creation with secure email invite system, improving security protocols",
          "Set up deduplication logic and 7-day expiration on invites to prevent abuse and manage resources",
          "Improved admin user experience with status notifications and cleaned-up form interfaces",
          "Enhanced overall platform security and user management workflow efficiency"
        ],
        technologies: [
          { name: "JavaScript", count: 5 },
          { name: "Node.js", count: 4 },
          { name: "Email Systems", count: 3 },
          { name: "Security", count: 2 }
        ]
      },
      'Donald': {
        highlights: [
          "Completed comprehensive onboarding processes for music sharing application",
          "Redesigned user interface to meet specifications for music sharing app onboarding flow",
          "Participated in team meetings to plan next steps for music sharing app development process",
          "Successfully improved user experience and interface design for better app adoption"
        ],
        technologies: [
          { name: "UI/UX", count: 5 },
          { name: "Design", count: 4 },
          { name: "Mobile Apps", count: 3 },
          { name: "User Research", count: 2 }
        ]
      },
      'Judah': {
        highlights: [
          "Created comprehensive quiz page with 16 questions, each featuring helpful tooltips for user guidance",
          "Implemented gamification elements to increase user engagement and encourage return visits",
          "Developed dynamic roadmap displaying necessary steps with progress tracking from 0% to 100%",
          "Built interactive checklist counter system for each category to show completion progress"
        ],
        technologies: [
          { name: "JavaScript", count: 6 },
          { name: "HTML", count: 5 },
          { name: "CSS", count: 4 },
          { name: "UI/UX", count: 3 }
        ]
      },
      'Asmar': {
        highlights: [
          "Imported 11,000+ contacts to GoHighLevel platform, significantly expanding client database",
          "Automated 10 scheduling appointments, streamlining booking process and improving efficiency",
          "Set up 10+ paid courses and live sessions on Zenler and Beacons.ai platforms",
          "Successfully integrated multiple platforms to create comprehensive client management system"
        ],
        technologies: [
          { name: "GoHighLevel", count: 5 },
          { name: "Automation", count: 4 },
          { name: "CRM", count: 3 },
          { name: "Integration", count: 2 }
        ]
      }
  };

  return details[internName] || {
      highlights: ["Completed summer internship successfully!", "Contributed to multiple team projects", "Demonstrated strong learning and growth", "Built valuable professional relationships"],
      technologies: [
        { name: "JavaScript", count: 5 },
        { name: "HTML", count: 4 },
        { name: "CSS", count: 3 },
        { name: "Git", count: 2 }
      ]
  };
};

export const cohortData = {
  technologies: [
    { name: "JavaScript", count: 45, color: "text-blue-600" },
    { name: "React", count: 38, color: "text-cyan-600" },
    { name: "Python", count: 32, color: "text-green-600" },
    { name: "HTML", count: 28, color: "text-orange-600" },
    { name: "CSS", count: 25, color: "text-purple-600" },
    { name: "API", count: 22, color: "text-red-600" },
    { name: "Git", count: 20, color: "text-gray-600" },
    { name: "Node.js", count: 18, color: "text-emerald-600" }
  ]
};

export const internshipTips = [
  {
    title: "Identify Future Work Opportunities",
    description: "Look for ongoing projects where you can add value beyond your internship.",
    checklist: [
      "Research upcoming company initiatives and projects",
      "Prepare specific proposals for how you could contribute",
      "Identify gaps where your skills could make an impact"
    ],
    hasTemplate: true,
    templateType: "proposal"
  },
  {
    title: "Schedule a Fall Follow-up Meeting",
    description: "Before your internship ends this week, schedule a meeting for this fall.",
    checklist: [
      "Email your manager to request a fall check-in meeting",
      "Propose specific dates in September or October",
      "Prepare talking points about your growth and interests"
    ],
    hasTemplate: true,
    templateType: "email"
  },
  {
    title: "Create Comprehensive Documentation",
    description: "Document all your projects, processes, and learnings.",
    checklist: [
      "Write detailed project summaries and outcomes",
      "Create step-by-step process documentation",
      "Compile lessons learned and recommendations"
    ]
  },
  {
    title: "Build Internal Relationships",
    description: "Connect with colleagues across teams and maintain relationships.",
    checklist: [
      "Add all team members and colleagues on LinkedIn",
      "Schedule informal coffee chats before you leave",
      "Ask for contact information to stay in touch"
    ]
  },
  {
    title: "Express Genuine Interest",
    description: "Clearly communicate your interest in joining the company full-time.",
    checklist: [
      "Tell your manager about your interest in returning",
      "Be specific about roles and teams that interest you",
      "Ask about the full-time hiring timeline and process"
    ]
  },
  {
    title: "Stay Engaged After Your Internship",
    description: "Follow up monthly with updates on your studies and projects.",
    checklist: [
      "Send monthly updates to your manager and team",
      "Share relevant articles or insights with former colleagues",
      "Engage with company posts on LinkedIn and social media"
    ]
  }
];

const CohortDashboard = () => {
  const [currentView, setCurrentView] = useState('summary');
  const [selectedIntern, setSelectedIntern] = useState(null);

  const cohortData = {
    technologies: [
      { name: "JavaScript", count: 45, color: "text-blue-600" },
      { name: "React", count: 38, color: "text-cyan-600" },
      { name: "Python", count: 32, color: "text-green-600" },
      { name: "HTML", count: 28, color: "text-orange-600" },
      { name: "CSS", count: 25, color: "text-purple-600" },
      { name: "API", count: 22, color: "text-red-600" },
      { name: "Git", count: 20, color: "text-gray-600" },
      { name: "Node.js", count: 18, color: "text-emerald-600" }
    ]
  };

  const internshipTips = [
    {
      title: "Identify Future Work Opportunities",
      description: "Look for ongoing projects where you can add value beyond your internship.",
      checklist: [
        "Research upcoming company initiatives and projects",
        "Prepare specific proposals for how you could contribute",
        "Identify gaps where your skills could make an impact"
      ],
      hasTemplate: true,
      templateType: "proposal"
    },
    {
      title: "Schedule a Fall Follow-up Meeting",
      description: "Before your internship ends this week, schedule a meeting for this fall.",
      checklist: [
        "Email your manager to request a fall check-in meeting",
        "Propose specific dates in September or October",
        "Prepare talking points about your growth and interests"
      ],
      hasTemplate: true,
      templateType: "email"
    },
    {
      title: "Create Comprehensive Documentation",
      description: "Document all your projects, processes, and learnings.",
      checklist: [
        "Write detailed project summaries and outcomes",
        "Create step-by-step process documentation",
        "Compile lessons learned and recommendations"
      ]
    },
    {
      title: "Build Internal Relationships",
      description: "Connect with colleagues across teams and maintain relationships.",
      checklist: [
        "Add all team members and colleagues on LinkedIn",
        "Schedule informal coffee chats before you leave",
        "Ask for contact information to stay in touch"
      ]
    },
    {
      title: "Express Genuine Interest",
      description: "Clearly communicate your interest in joining the company full-time.",
      checklist: [
        "Tell your manager about your interest in returning",
        "Be specific about roles and teams that interest you",
        "Ask about the full-time hiring timeline and process"
      ]
    },
    {
      title: "Stay Engaged After Your Internship",
      description: "Follow up monthly with updates on your studies and projects.",
      checklist: [
        "Send monthly updates to your manager and team",
        "Share relevant articles or insights with former colleagues",
        "Engage with company posts on LinkedIn and social media"
      ]
    }
  ];

  const viewInternReport = (internName) => {
    setSelectedIntern(internName);
    setCurrentView('report');
  };

  const backToSummary = () => {
    setCurrentView('summary');
    setSelectedIntern(null);
  };

  if (currentView === 'summary') {
    return (
      <div 
        className="min-h-screen text-white relative"
        style={{backgroundColor: '#200043', fontFamily: 'system-ui, -apple-system, sans-serif'}}
      >
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 150 }, (_, i) => (
            <div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-6xl mr-auto p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-white mb-4">Summer 2025 Intern Reports</h1>
              <p className="text-xl text-purple-200">Click on any intern to view their detailed report</p>
            </div>
            <div className="flex-shrink-0 w-20"></div>
          </div>

          {/* Program Overview Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="flex items-center justify-center mb-4">
                <CheckCircle className="w-16 h-16 text-green-400" />
              </div>
              <div className="text-6xl font-bold text-white mb-2">49</div>
              <div className="text-xl text-purple-200">Total Reports</div>
              <div className="text-sm text-purple-300 mt-2">Across all 17 interns</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-16 h-16 text-yellow-400 fill-current" />
              </div>
              <div className="text-6xl font-bold text-white mb-2">{cohortAllInterns.reduce((s,i)=>s+i.stars,0).toLocaleString()}</div>
              <div className="text-xl text-purple-200">Total Stars Earned</div>
              <div className="text-sm text-purple-300 mt-2">By entire cohort</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="flex items-center justify-center mb-4">
                <Lightbulb className="w-16 h-16 text-yellow-400" />
              </div>
              <div className="text-6xl font-bold text-white mb-2">48</div>
              <div className="text-xl text-purple-200">Unique Ideas</div>
              <div className="text-sm text-purple-300 mt-2">Plus One Ideas submitted</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-3 text-green-400" />
                Reports Over Time
              </h3>
              <div className="h-48 flex items-end justify-center space-x-3">
                {[
                  { week: 'Jul 21', count: 2 },
                  { week: 'Jul 28', count: 5 },
                  { week: 'Aug 4', count: 8 },
                  { week: 'Aug 11', count: 12 },
                  { week: 'Aug 18', count: 22 }
                ].map((data, idx) => (
                  <div key={idx} className="flex flex-col items-center space-y-2">
                    <div className="text-xs text-purple-200 font-medium">{data.count}</div>
                    <div 
                      className="bg-gradient-to-t from-green-400 to-blue-400 rounded-t-lg w-8 transition-all duration-500 hover:scale-105"
                      style={{ height: `${(data.count / 22) * 140}px`, minHeight: '20px' }}
                    ></div>
                    <div className="text-xs text-purple-300 transform -rotate-45 whitespace-nowrap">{data.week}</div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <div className="text-sm text-purple-300">Weekly submission trends</div>
              </div>
            </div>
          </div>

          {/* Top Technologies */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Code className="w-8 h-8 mr-3 text-blue-400" />
              Top Technologies Across Cohort
            </h3>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 min-h-[200px] flex flex-wrap items-center justify-center gap-6">
              {cohortData.technologies.map((tech, idx) => {
                const fontSize = Math.max(20, Math.min(48, tech.count * 1.2));
                const colors = ['text-blue-300', 'text-purple-300', 'text-green-300', 'text-orange-300', 'text-red-300', 'text-cyan-300', 'text-yellow-300', 'text-pink-300'];
                const bgColors = ['bg-blue-500/20', 'bg-purple-500/20', 'bg-green-500/20', 'bg-orange-500/20', 'bg-red-500/20', 'bg-cyan-500/20', 'bg-yellow-500/20', 'bg-pink-500/20'];
                const color = colors[idx % colors.length];
                const bgColor = bgColors[idx % bgColors.length];
                
                return (
                  <div 
                    key={idx} 
                    className={`${bgColor} px-6 py-3 rounded-full hover:scale-110 transition-all duration-300 cursor-default shadow-lg border border-white/20 backdrop-blur-sm`}
                  >
                    <span 
                      className={`font-bold ${color}`}
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      {tech.name}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-center mt-4">
              <div className="text-sm text-purple-300">Technologies sized by usage frequency across all interns</div>
            </div>
          </div>

          {/* Innovative Ideas Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Lightbulb className="w-8 h-8 mr-3 text-yellow-400" />
              Innovative Ideas from Interns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-6 border border-yellow-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 aspect-square bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">A</div>
                  <div>
                    <h4 className="font-semibold text-yellow-200 mb-2">Enhanced Leaderboard Experience</h4>
                    <p className="text-yellow-100 text-sm leading-relaxed">"Improve the current leaderboard by making it more engaging and useful for new users. Display all users visibly and make each profile clickable so users can see how others earned their stars, view short bios, and learn from top performers."</p>
                    <div className="text-yellow-400 text-xs mt-2">— Abdulbari</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 aspect-square bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">Y</div>
                  <div>
                    <h4 className="font-semibold text-blue-200 mb-2">Backend Data Flow Mastery</h4>
                    <p className="text-blue-100 text-sm leading-relaxed">"Learn backend skills, especially how data flows through different endpoints with medium complexity. Understanding how Instagram data gets completely displayed in the product through proper endpoint architecture."</p>
                    <div className="text-blue-400 text-xs mt-2">— Yuzhen</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-6 border border-green-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 aspect-square bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">R</div>
                  <div>
                    <h4 className="font-semibold text-green-200 mb-2">Design Iteration Philosophy</h4>
                    <p className="text-green-100 text-sm leading-relaxed">"Design takes time, and iteration is everything. This week I really saw how much time and thought goes into building a clean, responsive landing page from scratch. Even small UI tweaks or layout choices can make a big difference."</p>
                    <div className="text-green-400 text-xs mt-2">— Rudgino</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 aspect-square bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">A</div>
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">Step-by-Step Data Processing</h4>
                    <p className="text-purple-100 text-sm leading-relaxed">"I learned how to actually take things step-by-step, as discovered during the process of cleaning unstructured data of contacts numbering in thousands, given to me by the employer in wildly different formats."</p>
                    <div className="text-purple-400 text-xs mt-2">— Asmar</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Common Challenges Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-12 border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Users className="w-8 h-8 mr-3 text-orange-400" />
              Common Challenges & Support Needs
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-6 border border-orange-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-orange-200 mb-2">Technical Learning Curve</h4>
                    <div className="text-xs text-orange-300 bg-orange-900/30 px-3 py-1 rounded-full inline-block">25% of support requests</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-900/30 to-indigo-900/30 rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-blue-200 mb-2">Feedback & Code Review</h4>
                    <div className="text-xs text-blue-300 bg-blue-900/30 px-3 py-1 rounded-full inline-block">50% of support requests</div>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-purple-200 mb-2">Clear Communication & Expectations</h4>
                    <div className="text-xs text-purple-300 bg-purple-900/30 px-3 py-1 rounded-full inline-block">25% of support requests</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10 text-left">
              <h5 className="text-white font-semibold mb-2 text-left">Key Insights for Future Cohorts:</h5>
              <ul className="text-purple-200 text-sm space-y-1 text-left">
                <li>Provide more structured JavaScript learning resources and coding workshops</li>
                <li>Implement regular code review sessions with senior developers</li>
                <li>Establish clear deliverable expectations and feedback cycles</li>
                <li>Maintain strong mentorship programs that have proven successful</li>
              </ul>
            </div>
          </div>

          {/* Intern Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cohortAllInterns.map((intern, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer group" onClick={() => viewInternReport(intern.name)}>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg font-bold text-white">
                    {intern.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronRight className="w-6 h-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{intern.name}</h3>
                <p className="text-purple-200 text-sm mb-4">Manager: {intern.manager}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-yellow-300 font-semibold">{intern.stars}</span>
                  </div>
                  <div className="text-purple-200 text-sm">
                    {intern.reports} reports
                  </div>
                </div>
                <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors duration-200">
                  View Report
                </button>
              </div>
            ))}
          </div>

          <div className="text-center py-8 mt-10 border-t border-white/20">
            <p className="text-purple-300 mb-2">CareerStar • Summer 2025 Internship Program</p>
            <p className="text-purple-400 text-sm">Questions? Message us hello@careerstar.co</p>
          </div>
        </div>
      </div>
    );
  }

  const currentIntern = cohortAllInterns.find(intern => intern.name === selectedIntern);
  const currentInternDetails = getCohortInternDetails(selectedIntern);

  return (
    <div className="min-h-screen text-white relative" style={{backgroundColor: '#200043', fontFamily: 'system-ui, -apple-system, sans-serif'}}>
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 150 }, (_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-80"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="flex items-start justify-between mb-8">
          <div className="p-4">
            <button onClick={backToSummary} className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2 text-white text-sm hover:bg-white/30 transition-colors">← Back to Summary</button>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-white mb-2">{currentIntern?.name}</h1>
            <p className="text-lg text-purple-300">Manager: {currentIntern?.manager}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex items-center justify-center"><div className="text-2xl mr-3">🌟</div><h2 className="text-2xl font-bold" style={{color:'#200043'}}>Fantastic Job this Summer!</h2></div>
        </div>

        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><Star className="w-12 h-12 text-yellow-500 fill-current mx-auto mb-4" /><div className="text-4xl font-bold text-gray-800 mb-2">{currentIntern?.stars}</div><div className="text-gray-600">Stars Earned</div></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" /><div className="text-4xl font-bold text-gray-800 mb-2">{currentInternDetails.highlights.length}</div><div className="text-gray-600">Work Highlights</div></div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center"><CheckCircle className="w-12 h-12 text-blue-500 mx-auto mb-4" /><div className="text-4xl font-bold text-gray-800 mb-2">{currentIntern?.reports}</div><div className="text-gray-600">Reports Submitted</div></div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center text-left"><Award className="w-8 h-8 mr-3 text-green-600" />Summer Accomplishments</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentInternDetails.highlights.map((highlight, idx) => (
              <div key={idx} className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl border border-green-200"><CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" /><p className="text-gray-700 text-left">{highlight}</p></div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Code className="w-8 h-8 mr-3 text-blue-600" />Top Technologies / Skills</h3>
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 min-h-[200px] flex flex-wrap items-center justify-center gap-6">
            {currentInternDetails.technologies.map((tech, idx) => {
              const fontSize = Math.max(24, Math.min(56, tech.count * 7));
              const colors = ['text-blue-600','text-purple-600','text-green-600','text-orange-600'];
              const bgColors = ['bg-blue-100','bg-purple-100','bg-green-100','bg-orange-100'];
              const color = colors[idx % colors.length];
              const bgColor = bgColors[idx % bgColors.length];
              return (
                <div key={idx} className={`${bgColor} px-6 py-3 rounded-full shadow-md`}><span className={`font-bold ${color}`} style={{ fontSize: `${fontSize}px` }}>{tech.name}</span></div>
              );
            })}
          </div>
        </div>

        {/* Top Technologies / Skills Across Cohort */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users className="w-8 h-8 mr-3 text-gray-600" />Top Technologies / Skills Across Cohort</h3>
          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cohortData.technologies.map((tech, idx) => (
                <div key={idx} className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className={`text-xl font-bold ${tech.color} mb-1`}>{tech.name}</div>
                  <div className="text-sm text-gray-500">{tech.count} mentions</div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div className={`h-2 rounded-full ${tech.color.replace('text-', 'bg-')}`} style={{ width: `${(tech.count / 45) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Turn Your Internship Into a Job Offer */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center"><Users className="w-8 h-8 mr-3 text-indigo-600" />Turn Your Internship Into a Job Offer</h3>
          <div className="space-y-6">
            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2 text-lg text-left">Identify Future Work Opportunities</h4>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed text-left">Look for ongoing projects where you can add value beyond your internship.</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Research upcoming company initiatives and projects</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Prepare specific proposals for how you could contribute</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Identify gaps where your skills could make an impact</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <details className="bg-white rounded-lg border border-indigo-200">
                  <summary className="cursor-pointer p-3 font-medium text-indigo-700 hover:text-indigo-900 text-sm text-left">📄 Project Proposal Template</summary>
                  <div className="p-4 border-t border-indigo-100 text-xs bg-gray-50">
                    <div className="bg-white p-3 rounded border text-gray-800 leading-relaxed text-left" id="proposal-template-box">
                      <strong>TO:</strong> [Manager/Team Lead Name]<br/>
                      <strong>FROM:</strong> [Your Name]<br/>
                      <strong>DATE:</strong> [Current Date]<br/>
                      <strong>SUBJECT:</strong> Proposal for [Project Name]
                      <br/><br/>
                      <strong>Executive Summary</strong><br/>
                      [2-3 sentences describing the project, its main goal, and the value it will bring to the company.]
                      <br/><br/>
                      <strong>Problem Statement</strong><br/>
                      Current Challenge: [Describe the specific problem or opportunity you've identified]<br/>
                      Impact: [Explain what happens if this problem continues unchanged]
                      <br/><br/>
                      <strong>Proposed Solution</strong><br/>
                      Project Overview: [Detailed description of your proposed solution]<br/>
                      Approach: [Step-by-step breakdown of how you would execute this project]
                      <br/><br/>
                      <strong>Value Proposition</strong><br/>
                      Expected Benefits: [Specific improvements, time savings, or strategic alignment]
                      <br/><br/>
                      <strong>Timeline & Success Metrics</strong><br/>
                      Key Milestones: [Weekly breakdown of major deliverables]<br/>
                      Success Metrics: [How you'll measure project success]
                      <br/><br/>
                      <strong>Resource Requirements</strong><br/>
                      Time Commitment: [Hours per week]<br/>
                      Tools Needed: [Software, tools, or resources]<br/>
                      Support Needed: [Team collaboration or access required]
                    </div>
                    <div className="mt-3 text-center">
                      <button 
                        onClick={() => {
                          const text = document.getElementById('proposal-template-box').innerText;
                          navigator.clipboard.writeText(text).then(() => {
                            alert('Proposal template copied to clipboard!');
                          });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded transition-colors"
                      >
                        📄 Copy Template to Clipboard
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2 text-lg text-left">Schedule a Fall Follow-up Meeting</h4>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed text-left">Before your internship ends this week, schedule a meeting for this fall.</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Email your manager to request a fall check-in meeting</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Propose specific dates in September or October</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Prepare talking points about your growth and interests</p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <details className="bg-white rounded-lg border border-indigo-200">
                  <summary className="cursor-pointer p-3 font-medium text-indigo-700 hover:text-indigo-900 text-sm text-left">📄 Fall Check-in Email Template</summary>
                  <div className="p-4 border-t border-indigo-100 text-xs bg-gray-50">
                    <div className="bg-white p-3 rounded border text-gray-800 leading-relaxed text-left" id="email-template-box">
                      <strong>Subject:</strong> Follow-up Meeting Request - [Your Name] Fall Check-in
                      <br/><br/>
                      Dear [Manager's Name],
                      <br/><br/>
                      I hope this email finds you well! As my internship with [Company Name] comes to an end this week, I wanted to reach out to schedule a follow-up meeting for this fall.
                      <br/><br/>
                      <strong>Purpose of the Meeting:</strong><br/>
                      I would love the opportunity to:
                      <ul className="ml-4 mt-1 list-disc text-xs">
                        <li>Share updates on my academic progress and relevant projects</li>
                        <li>Discuss my continued interest in [Company Name] and future opportunities</li>
                        <li>Get your advice on my professional development and career path</li>
                        <li>Maintain our professional relationship and stay connected with the team</li>
                      </ul>
                      <br/>
                      <strong>My Availability:</strong><br/>
                      I'm flexible with timing and would be happy to work around your schedule. Some options include:
                      <ul className="ml-4 mt-1 list-disc text-xs">
                        <li>[Specific date range, e.g., "September 15-30"]</li>
                        <li>[Preferred days/times, e.g., "Tuesday or Wednesday afternoons"]</li>
                        <li>[Format preference, e.g., "In-person, video call, or phone call"]</li>
                      </ul>
                      <br/>
                      I truly valued my time working with you and the team this summer. Thank you for your time and consideration. I look forward to hearing from you!
                      <br/><br/>
                      Best regards,<br/>
                      [Your Full Name]<br/>
                      [Your Phone Number]<br/>
                      [Your Email Address]<br/>
                      [Your LinkedIn Profile URL]
                    </div>
                    <div className="mt-3 text-center">
                      <button 
                        onClick={() => {
                          const text = document.getElementById('email-template-box').innerText;
                          navigator.clipboard.writeText(text).then(() => {
                            alert('Email template copied to clipboard!');
                          });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded transition-colors"
                      >
                        📄 Copy Template to Clipboard
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </div>

            <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-200">
              <h4 className="font-semibold text-indigo-800 mb-2 text-lg text-left">Before You Leave Checklist</h4>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed text-left">Essential tasks to complete before your last day to maintain relationships and set yourself up for future opportunities.</p>
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Document all current work and prepare handover notes</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Schedule handover meetings with relevant team members</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-indigo-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">Return all company hardware and equipment</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-4 h-4 border-2 border-red-400 rounded bg-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm"><strong>CRITICAL: Request a LinkedIn referral from your manager</strong></p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <details className="bg-white rounded-lg border border-indigo-200">
                  <summary className="cursor-pointer p-3 font-medium text-indigo-700 hover:text-indigo-900 text-sm text-left">📄 LinkedIn Referral Request Template</summary>
                  <div className="p-4 border-t border-indigo-100 text-xs bg-gray-50">
                    <div className="bg-white p-3 rounded border text-gray-800 leading-relaxed text-left" id="referral-template-box">
                      <strong>Subject:</strong> LinkedIn Referral Request - [Your Name]
                      <br/><br/>
                      Hi [Manager's Name],
                      <br/><br/>
                      As my internship comes to an end, I wanted to ask if you'd be willing to write a LinkedIn referral for me. I know you're busy, so I've drafted some specific points below that you could use or modify as you see fit:
                      <br/><br/>
                      <strong>Suggested referral points:</strong>
                      <br/><br/>
                      <em>"[Your Name] was an exceptional intern who consistently delivered high-quality work during their time with our team. Specifically, they:</em>
                      <br/><br/>
                      <em>• [Insert your top accomplishment, e.g., "Successfully created two interactive activities for our Career Star website, demonstrating strong design thinking and attention to user experience"]</em>
                      <br/><br/>
                      <em>• [Insert second accomplishment, e.g., "Led a presentation to 20+ students with engaging group exercises, showing excellent communication and leadership skills"]</em>
                      <br/><br/>
                      <em>• [Insert third accomplishment/skill, e.g., "Quickly learned new tools like Figma and contributed meaningful design work from day one"]</em>
                      <br/><br/>
                      <em>• [Insert soft skill example, e.g., "Proactively collaborated with team members and consistently met all deadlines while maintaining a positive attitude"]</em>
                      <br/><br/>
                      <em>[Your Name] would be a valuable addition to any team. They bring both technical skills and a collaborative mindset that made them a pleasure to work with. I highly recommend them for [type of role, e.g., 'design or frontend development roles."]</em>
                      <br/><br/>
                      Feel free to edit this in any way that feels authentic to your experience working with me. If you prefer to write something completely different, that would be wonderful too!
                      <br/><br/>
                      Thank you so much for everything you've taught me this summer and for considering this request.
                      <br/><br/>
                      Best regards,<br/>
                      [Your Name]<br/>
                      [Your LinkedIn Profile URL]
                    </div>
                    <div className="mt-3 text-center">
                      <button 
                        onClick={() => {
                          const text = document.getElementById('referral-template-box').innerText;
                          navigator.clipboard.writeText(text).then(() => {
                            alert('LinkedIn referral request template copied to clipboard!');
                          });
                        }}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded transition-colors"
                      >
                        📄 Copy Template to Clipboard
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            </div>
          </div>
        </div>

        

        <div className="text-center py-8 border-t border-white/20"><p className="text-purple-300 mb-2">CareerStar • Summer 2025 Internship Program</p><p className="text-purple-400 text-sm">Questions? Message us hello@careerstar.co</p></div>
      </div>
    </div>
  );
};

export default CohortDashboard;


