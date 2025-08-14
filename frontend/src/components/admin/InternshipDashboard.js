import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  LineChart,
  Line
} from 'recharts';
import {
  AlertCircle as AlertCircleIcon,
  CheckCircle as CheckCircleIcon,
  UserPlus as UserPlusIcon,
  Clock as ClockIcon,
  ChevronDown as ChevronDownIcon,
  Bell as BellIcon,
  Settings as SettingsIcon,
  ArrowLeft as ArrowLeftIcon,
  Calendar as CalendarIcon,
  TrendingUp as TrendingUpIcon,
  FileText as FileTextIcon,
  Star as StarIcon,
  GitPullRequest as GitPullRequestIcon,
  Users as UsersIcon,
  BarChart2 as BarChart2Icon,
  Info as InfoIcon,
  AlertTriangle as AlertTriangleIcon
} from 'lucide-react';

function HeaderBar({ selectedCohort, setSelectedCohort, selectedUniversity, setSelectedUniversity, reportFilter, setReportFilter }) {
  const universities = ['Baruch College', 'Brooklyn College', 'City College of New York', 'City Tech','Hunter College', 'Queens College', 'Lehman College', 'John Jay College of Criminal Justice', 'College of Staten Island', 'Medgar Evers College', 'York College'];
  const cohorts = ['Winter 2025', 'Spring 2025', 'Fall 2025', 'Summer 2025', 'Cohort 1', 'Cohort 2'];
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Internship Program Dashboard</h1>
            <div className="flex items-center mt-2 gap-4">
              <div className="relative">
                <select value={selectedUniversity} onChange={(e) => setSelectedUniversity(e.target.value)} className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {universities.map((uni) => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <div className="relative">
                <select value={selectedCohort} onChange={(e) => setSelectedCohort(e.target.value)} className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {cohorts.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
              <div className="relative">
                <select value={reportFilter} onChange={(e) => setReportFilter(e.target.value)} className="appearance-none bg-gray-50 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  {['All', 'Cohort 1', 'Cohort 2'].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function ReportsChart({ data = [], totals = { totalReports: 0, avgCompletion: 0, missingReports: 0 } }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-800">Weekly Report Submissions</h2>
          <div className="group relative">
            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs rounded p-2 w-48">Shows the number of reports submitted each week and completion rate.</div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-blue-500"></div><span className="text-xs text-gray-600">Reports</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-400"></div><span className="text-xs text-gray-600">Completion %</span></div>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#4ADE80" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip />
            <Area yAxisId="left" type="monotone" dataKey="reports" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReports)" />
            <Area yAxisId="right" type="monotone" dataKey="completion" stroke="#4ADE80" fillOpacity={1} fill="url(#colorCompletion)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <div className="text-gray-500">Total Reports: <span className="font-semibold text-gray-700">{totals.totalReports}</span></div>
        <div className="text-gray-500">Avg. Completion: <span className="font-semibold text-gray-700">{totals.avgCompletion.toFixed(1)}%</span></div>
        <div className="text-gray-500">Missing Reports: <span className="font-semibold text-red-500">{totals.missingReports}</span></div>
      </div>
    </div>
  );
}

function ActionItems({ onSelectIntern }) {
  const actionItems = [
    { type: 'onboarding', title: 'Complete Onboarding', users: ['Fahima Zannat', 'Wei Chong'], priority: 'high', icon: UserPlusIcon },
    { type: 'feedback', title: 'Review Pending Feedback', users: ['Jade Acevedo', 'Rudgino Parkes', 'Donald Witherspoon'], priority: 'medium', icon: ClockIcon },
    { type: 'risk', title: 'Address Risk Flags', users: ['Wei Chong', 'Akachukwu Obi', 'Jade Acevedo'], priority: 'high', icon: AlertCircleIcon }
  ];
  const getPriorityColor = (priority) => (priority === 'high' ? 'bg-red-100 text-red-700' : priority === 'medium' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700');
  const getIconBg = (type) => (type === 'onboarding' ? 'bg-blue-50' : type === 'feedback' ? 'bg-orange-50' : 'bg-red-50');
  const getIconColor = (type) => (type === 'onboarding' ? 'text-blue-500' : type === 'feedback' ? 'text-orange-500' : 'text-red-500');
  return (
    <div className="bg-white p-5 pb-8 rounded-lg shadow-sm border border-gray-200 internship-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Action Items</h2>
        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">{actionItems.length} Pending</span>
      </div>
      <div className="space-y-3">
        {actionItems.map((item, index) => (
          <div key={index} className="p-3 border border-gray-200 rounded-lg">
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-full ${getIconBg(item.type)}`}>
                <item.icon className={`w-5 h-5 ${getIconColor(item.type)}`} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-gray-800">{item.title}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                </div>
                <div className="mt-2 space-y-1.5">
                  {item.users.map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded text-sm">
                      <button className="text-gray-700 hover:text-blue-600 hover:underline text-left" onClick={() => onSelectIntern(user)}>{user}</button>
                      <button className="text-blue-600 hover:text-blue-800 text-xs">Resolve</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-800">
          <CheckCircleIcon className="w-4 h-4" />
          <span>Mark All as Complete</span>
      </button>
      </div>
    </div>
  );
}

function TechnologyTrends({ tech = [] }) {
  const technologies = Array.isArray(tech) ? tech : [];
  const getBarColorByIndex = (index) => {
    const palette = ['#4299E1', '#9F7AEA', '#F687B3', '#48BB78', '#ED8936', '#667EEA', '#F6AD55', '#10B981', '#FB7185', '#60A5FA'];
    return palette[index % palette.length];
  };
  return (
    <div className="bg-white p-5 pb-8 rounded-lg shadow-sm border border-gray-200 internship-card tech-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Top Technologies Used</h2>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={technologies} margin={{ top: 5, right: 30, left: 80, bottom: 5 }}>
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} className="internship-yaxis" />
            <Tooltip formatter={(value) => [`${value}`, 'Count']} labelStyle={{ fontWeight: 'bold' }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {technologies.map((entry, index) => (
                <Bar key={`bar-${index}`} dataKey="count" fill={getBarColorByIndex(index)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 mb-1 text-xs text-gray-500">Items: {technologies.length}</div>
    </div>
  );
}

function SentimentAnalysis({ riskFlags: riskFlagsProp }) {
  const sentimentData = [
    { week: 'Week 1', positive: 72, neutral: 20, negative: 8 },
    { week: 'Week 2', positive: 68, neutral: 24, negative: 8 },
    { week: 'Week 3', positive: 70, neutral: 22, negative: 8 },
    { week: 'Week 4', positive: 65, neutral: 25, negative: 10 },
    { week: 'Week 5', positive: 62, neutral: 26, negative: 12 },
    { week: 'Week 6', positive: 68, neutral: 22, negative: 10 },
    { week: 'Week 7', positive: 75, neutral: 18, negative: 7 },
    { week: 'Week 8', positive: 78, neutral: 16, negative: 6 }
  ];
  const fallbackRiskFlags = [
    { intern: 'Wei Chong', issue: 'Struggling with project scope and deadlines', week: 'Week 5' },
    { intern: 'Akachukwu Obi', issue: 'Communication challenges with mentor', week: 'Week 4' },
    { intern: 'Jade Acevedo', issue: 'Technical difficulties with development environment', week: 'Week 5' }
  ];
  const riskFlags = Array.isArray(riskFlagsProp) && riskFlagsProp.length > 0 ? riskFlagsProp : fallbackRiskFlags;
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Sentiment Analysis & Risk Management</h2>
        <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option>All Interns</option>
          <option>High Risk Only</option>
          <option>Medium Risk Only</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="positive" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="neutral" stroke="#6B7280" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="negative" stroke="#EF4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">Sentiment analysis from weekly report free-text responses</div>
        </div>
        <div>
          <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2 mb-3"><AlertTriangleIcon className="w-5 h-5 text-orange-500" /><h3 className="font-medium text-orange-800">Risk Flags (Last 2 Weeks)</h3></div>
            <div className="space-y-3">
              {riskFlags.map((flag, index) => (
                <div key={index} className="bg-white p-2 rounded border border-orange-100 text-sm">
                  <div className="flex justify-between"><span className="font-medium text-gray-800">{flag.intern}</span><span className="text-xs text-gray-500">{flag.week}</span></div>
                  <p className="text-gray-600 mt-1">{flag.issue}</p>
                  <div className="flex justify-end mt-1"><button className="text-xs text-blue-600 hover:underline">Contact Intern</button></div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-center"><button className="text-xs text-blue-600 hover:underline">View All Risk Flags</button></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InternLeaderboard({ onSelectIntern, onViewAll, interns = [] }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Intern Performance Leaderboard</h2>
        <div className="flex gap-2">
          <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>All Teams</option>
            <option>Engineering</option>
            <option>Design</option>
            <option>Product</option>
          </select>
          <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <option>This Month</option>
            <option>Last Month</option>
            <option>All Time</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-4 py-2 text-left">Rank</th>
              <th className="px-4 py-2 text-left">Intern</th>
              <th className="px-4 py-2 text-center">Total Score</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {interns.map((intern, index) => (
              <tr key={intern.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    {index < 3 ? (
                      <div className={`w-6 h-6 flex items-center justify-center rounded-full ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-amber-600'}`}>
                        <StarIcon className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 flex items-center justify-center text-sm text-gray-500">{index + 1}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <img className="h-8 w-8 rounded-full mr-2" src={intern.avatar} alt={intern.name} />
                    <div>
                      <div className="font-medium text-gray-800">{intern.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="text-sm font-semibold text-gray-800">{intern.score}</div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <button onClick={() => onSelectIntern(intern)} className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 text-center">
        <button onClick={onViewAll} className="text-sm text-blue-600 hover:underline">View All Interns</button>
      </div>
    </div>
  );
}

function MetricsOverview({ metricsLatest }) {
  const entries = metricsLatest && typeof metricsLatest === 'object' ? Object.entries(metricsLatest) : [];
  const display = entries.slice(0, 4).map(([k, v]) => ({ title: String(k), value: String(v) }));
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 metrics-card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {display.length === 0 ? (
          <div className="text-sm text-gray-500">No metrics available.</div>
        ) : display.map((metric, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 metric-tile">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-gray-500">{metric.title}</div>
                <div className="text-lg font-semibold text-gray-800 mt-1">{metric.value}</div>
              </div>
              <div className={`p-2 rounded-full bg-blue-100 icon-circle`}>
                <TrendingUpIcon className={`w-4 h-4 text-blue-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InternDetails({ intern, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <button onClick={onBack} className="flex items-center text-blue-600 hover:underline"><ArrowLeftIcon className="w-4 h-4 mr-1" />Back to Dashboard</button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex items-center">
          <img src={intern.avatar} alt={intern.name} className="w-16 h-16 rounded-full mr-4" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{intern.name}</h1>
            <div className="text-gray-500">Total Score: {intern.score}</div>
          </div>
        </div>
      </div>
       <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'weekly-reports' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('weekly-reports')}>Weekly Reports</button>
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'contributions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('contributions')}>Contributions</button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Intern Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-full mr-3"><TrendingUpIcon className="w-5 h-5 text-blue-600" /></div><div><div className="text-sm text-gray-500">Performance Score</div><div className="text-xl font-semibold text-gray-800">{intern.score}</div></div></div></div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-full mr-3"><FileTextIcon className="w-5 h-5 text-green-600" /></div><div><div className="text-sm text-gray-500">Report Completion</div><div className="text-xl font-semibold text-gray-800">100%</div></div></div></div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100"><div className="flex items-center"><div className="p-2 bg-purple-100 rounded-full mr-3"><CalendarIcon className="w-5 h-5 text-purple-600" /></div><div><div className="text-sm text-gray-500">Program Progress</div><div className="text-xl font-semibold text-gray-800">Week 8/10</div></div></div></div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4"><h3 className="font-medium text-gray-700 mb-2">Summary</h3><p className="text-gray-600">{intern.name} has been consistently performing well throughout the internship program. Their technical skills and collaboration abilities have been highlighted by their mentors. They have completed all assigned tasks and have shown initiative in taking on additional responsibilities.</p></div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200"><h3 className="font-medium text-gray-700 mb-2">Mentor Feedback</h3><div className="text-gray-600"><p className="mb-2">"{intern.name} has demonstrated exceptional problem-solving skills and a willingness to learn. They've been a valuable addition to the team and have made significant contributions to our projects."</p><div className="text-right text-sm text-gray-500">- Senior Engineer, Week 6 Evaluation</div></div></div>
            </div>
          )}
          {activeTab === 'weekly-reports' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Reports</h2>
              <div className="text-center py-8 text-gray-500">No weekly reports available for this intern.</div>
            </div>
          )}
          {activeTab === 'contributions' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contributions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><div className="text-center"><div className="text-2xl font-bold text-blue-600">28</div><div className="text-sm text-gray-600">Code Contributions</div></div></div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100"><div className="text-center"><div className="text-2xl font-bold text-purple-600">15</div><div className="text-sm text-gray-600">Code Reviews</div></div></div>
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-100"><div className="text-center"><div className="text-2xl font-bold text-pink-600">8</div><div className="text-sm text-gray-600">Designs</div></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function CohortSummary({ cohort, university, onBack }) {
  const [activeTab, setActiveTab] = useState('overview');
  const weeklyData = [
    { week: 'Week 1', reportCompletion: 98, avgSentiment: 85, avgScore: 72 },
    { week: 'Week 2', reportCompletion: 95, avgSentiment: 80, avgScore: 75 },
    { week: 'Week 3', reportCompletion: 92, avgSentiment: 83, avgScore: 78 },
    { week: 'Week 4', reportCompletion: 90, avgSentiment: 78, avgScore: 80 },
    { week: 'Week 5', reportCompletion: 93, avgSentiment: 75, avgScore: 82 },
    { week: 'Week 6', reportCompletion: 94, avgSentiment: 82, avgScore: 85 },
    { week: 'Week 7', reportCompletion: 96, avgSentiment: 87, avgScore: 88 },
    { week: 'Week 8', reportCompletion: 97, avgSentiment: 90, avgScore: 90 }
  ];
  const skillsData = [
    { name: 'Technical Skills', score: 85 },
    { name: 'Communication', score: 78 },
    { name: 'Problem Solving', score: 82 },
    { name: 'Teamwork', score: 88 },
    { name: 'Initiative', score: 75 },
    { name: 'Adaptability', score: 80 }
  ];
  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6"><button onClick={onBack} className="flex items-center text-blue-600 hover:underline"><ArrowLeftIcon className="w-4 h-4 mr-1" />Back to Dashboard</button></div>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">{cohort} Cohort Summary</h1><div className="text-gray-500">{university}</div></div>
          <div className="flex items-center mt-4 md:mt-0"><div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center"><UsersIcon className="w-5 h-5 text-blue-600 mr-2" /><div><div className="text-sm text-gray-500">Total Interns</div><div className="text-lg font-semibold text-gray-800">112</div></div></div></div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('overview')}>Overview</button>
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'weekly' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('weekly')}>Weekly Breakdown</button>
            <button className={`px-4 py-3 text-sm font-medium ${activeTab === 'skills' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('skills')}>Skills Assessment</button>
          </nav>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Cohort Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100"><div className="flex items-center"><div className="p-2 bg-blue-100 rounded-full mr-3"><UsersIcon className="w-5 h-5 text-blue-600" /></div><div><div className="text-sm text-gray-500">Active Interns</div><div className="text-xl font-semibold text-gray-800">108/112</div></div></div></div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-100"><div className="flex items-center"><div className="p-2 bg-green-100 rounded-full mr-3"><TrendingUpIcon className="w-5 h-5 text-green-600" /></div><div><div className="text-sm text-gray-500">Avg. Performance</div><div className="text-xl font-semibold text-gray-800">82/100</div></div></div></div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100"><div className="flex items-center"><div className="p-2 bg-purple-100 rounded-full mr-3"><BarChart2Icon className="w-5 h-5 text-purple-600" /></div><div><div className="text-sm text-gray-500">Report Completion</div><div className="text-xl font-semibold text-gray-800">94.3%</div></div></div></div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-100"><div className="flex items-center"><div className="p-2 bg-orange-100 rounded-full mr-3"><CalendarIcon className="w-5 h-5 text-orange-600" /></div><div><div className="text-sm text-gray-500">Program Progress</div><div className="text-xl font-semibold text-gray-800">Week 8/10</div></div></div></div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-4">Performance Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="week" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgScore" name="Average Score" stroke="#3B82F6" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="reportCompletion" name="Report Completion %" stroke="#10B981" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'weekly' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Weekly Breakdown</h2>
              <div className="space-y-6">
                {weeklyData.map((week, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-700 mb-3">{week.week}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white p-3 rounded-lg border border-gray-100"><div className="text-sm text-gray-500">Report Completion</div><div className="text-xl font-semibold text-gray-800">{week.reportCompletion}%</div></div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100"><div className="text-sm text-gray-500">Average Sentiment</div><div className="text-xl font-semibold text-gray-800">{week.avgSentiment}/100</div></div>
                      <div className="bg-white p-3 rounded-lg border border-gray-100"><div className="text-sm text-gray-500">Average Score</div><div className="text-xl font-semibold text-gray-800">{week.avgScore}/100</div></div>
                    </div>
                    <div className="text-sm text-gray-500">Weekly notes and observations...</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === 'skills' && (
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Skills Assessment</h2>
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
                <h3 className="font-medium text-gray-700 mb-4">Cohort Skills Overview</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#6366F1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-700 mb-3">Key Observations</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>Strong teamwork and collaboration skills across the cohort</li>
                  <li>Technical skills improving consistently week over week</li>
                  <li>Initiative scores lower than previous cohorts</li>
                  <li>Communication skills vary widely - additional workshops recommended</li>
                  <li>Problem-solving abilities strong, particularly in engineering teams</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

const InternshipDashboard = () => {
  const [selectedCohort, setSelectedCohort] = useState('Summer 2025');
  const [selectedUniversity, setSelectedUniversity] = useState('City Tech');
  const [selectedIntern, setSelectedIntern] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [weeklyReportsData, setWeeklyReportsData] = useState([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportTotals, setReportTotals] = useState({ totalReports: 0, avgCompletion: 0, missingReports: 0 });
  const [allInterns, setAllInterns] = useState([]);
  const [loadingAllInterns, setLoadingAllInterns] = useState(false);
  const [allInternsError, setAllInternsError] = useState('');
  const [reportFilter, setReportFilter] = useState('All'); // All | Cohort 1 | Cohort 2
  const [techTrends, setTechTrends] = useState([]);
  const [metricsLatestData, setMetricsLatestData] = useState({});
  const [riskFlags, setRiskFlags] = useState([]);

  // Fetch leaderboard once on mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const topUsersRes = await fetch('https://api.careerstar.co/top-users');
        if (topUsersRes.ok) {
          const data = await topUsersRes.json();
          const topUsers = (data || []).map((u) => ({
            id: u.userId,
            name: u.firstname,
            score: u.stars,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.firstname || 'U')}`
          }));
          setLeaderboardUsers(topUsers);
        } else {
          setLeaderboardUsers([]);
        }
      } catch (e) {
        setLeaderboardUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  // Seed Technology Trends and MetricsOverview data from provided references
  useEffect(() => {
    // TechnologyTrends.tsx data
    const technologies = [
      { name: 'React', count: 78, category: 'frontend' },
      { name: 'TypeScript', count: 65, category: 'language' },
      { name: 'Figma', count: 52, category: 'design' },
      { name: 'Node.js', count: 47, category: 'backend' },
      { name: 'Python', count: 43, category: 'language' },
      { name: 'AWS', count: 38, category: 'cloud' },
      { name: 'MongoDB', count: 32, category: 'database' },
      { name: 'Docker', count: 29, category: 'devops' }
    ];
    setTechTrends(technologies);

    // MetricsOverview.tsx data mapped into a simple title->value object
    const metricsObj = {
      'Lines of Code': '45,872',
      'PRs Submitted': '328',
      'Designs Created': '94',
      'Active Interns': '112'
    };
    setMetricsLatestData(metricsObj);
  }, []);

  // Fetch weekly reports and filter by reportFilter
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const end = new Date();
        const reportsRes = await fetch('https://api.careerstar.co/admin/api/reports');
        if (reportsRes.ok) {
          const reports = await reportsRes.json();

          // Determine cohort filter based on dropdown
          let filteredReports = reports || [];
          if (reportFilter === 'Cohort 1' || reportFilter === 'Cohort 2') {
            filteredReports = filteredReports.filter(r => (r.user_cohort || '').toLowerCase().includes(reportFilter.toLowerCase()));
          }

          // Anchor weeks: Week 1 ends on July 11 of the selected cohort year at 11:59 PM, then every 7 days
          const yearMatch = (selectedCohort || '').match(/(\d{4})/);
          const anchorYear = yearMatch ? parseInt(yearMatch[1], 10) : new Date().getUTCFullYear();
          const anchorEndMs = Date.UTC(anchorYear, 6, 11, 23, 59, 59, 999); // July is month index 6
          const weekMs = 7 * 24 * 60 * 60 * 1000;

          const usersSet = new Set();
          const weekIndexToCount = new Map();
          for (const r of filteredReports) {
            usersSet.add(r.user_id);
            const d = r.report_date ? new Date(r.report_date) : null;
            if (!d || isNaN(d)) continue;
            const t = d.getTime();
            let idx = 1;
            if (t > anchorEndMs) {
              idx = 1 + Math.ceil((t - anchorEndMs) / weekMs);
            }
            weekIndexToCount.set(idx, (weekIndexToCount.get(idx) || 0) + 1);
          }

          const totalUsers = 26;
          const nowMs = Date.now();
          const currentWeekIndex = nowMs > anchorEndMs ? 1 + Math.ceil((nowMs - anchorEndMs) / weekMs) : 1;
          const startIdx = Math.max(1, currentWeekIndex - 7);
          const weekly = [];
          for (let idx = startIdx; idx <= currentWeekIndex; idx++) {
            const count = weekIndexToCount.get(idx) || 0;
            weekly.push({ week: `Week ${idx}`, reports: count, completion: Math.round((count / totalUsers) * 100) });
          }
          setWeeklyReportsData(weekly);

          // Build Risk Flags from recent reports (last 14 days), using Support Needed text
          const now = new Date();
          const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
          const recent = filteredReports.filter(r => {
            const d = r.report_date ? new Date(r.report_date) : null;
            return d && !isNaN(d) && d >= fourteenDaysAgo && d <= now;
          });
          // Deduplicate by user_id and map to risk flag entries
          const seen = new Set();
          const recentFlags = [];
          for (const r of recent) {
            if (seen.has(r.user_id)) continue;
            seen.add(r.user_id);
            const issue = r.answers && typeof r.answers === 'object' ? (r.answers.supportNeeded || r.answers.support_needed || '') : '';
            if (!issue) continue;
            const weekLabel = r.report_date ? new Date(r.report_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recent';
            recentFlags.push({ intern: r.student_name || 'Unknown', issue, week: weekLabel });
          }
          // Shuffle and pick up to 3 different students
          for (let i = recentFlags.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [recentFlags[i], recentFlags[j]] = [recentFlags[j], recentFlags[i]];
          }
          setRiskFlags(recentFlags.slice(0, 3));

          const totalReports = weekly.reduce((sum, w) => sum + (w.reports || 0), 0);
          const weeks = weekly.length || 1;
          const expectedTotal = totalUsers * weeks; // based on fixed totalUsers of 26
          const missingReports = Math.max(0, expectedTotal - totalReports);
          const avgCompletion = expectedTotal > 0 ? (totalReports / expectedTotal) * 100 : 0;
          setReportTotals({ totalReports, avgCompletion, missingReports });
        } else {
          setWeeklyReportsData([]);
          setReportTotals({ totalReports: 0, avgCompletion: 0, missingReports: 0 });
        }
      } catch (e) {
        setWeeklyReportsData([]);
        setReportTotals({ totalReports: 0, avgCompletion: 0, missingReports: 0 });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [selectedCohort, reportFilter]);

  const handleInternSelect = (intern) => {
    const normalized = typeof intern === 'object' ? intern : { name: intern, score: 0, avatar: 'https://randomuser.me/api/portraits/lego/1.jpg' };
    setSelectedIntern(normalized);
    setCurrentView('intern-details');
  };
  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedIntern(null);
  };
  const handleViewCohortSummary = () => setCurrentView('cohort-summary');

  const handleViewAllInterns = async () => {
    try {
      setLoadingAllInterns(true);
      setAllInternsError('');
      const adminToken = localStorage.getItem('admin_token') || '';
      const res = await fetch('https://api.careerstar.co/users', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Failed ${res.status}`);
      const json = await res.json();
      // Map API users into leaderboard row format
      const mapped = (Array.isArray(json.users) ? json.users : []).map((u) => ({
        id: u.userId,
        name: `${u.firstname}${u.lastname ? ' ' + u.lastname : ''}`,
        score: u.stars ?? 0,
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.firstname || 'U')}`
      }));
      setAllInterns(mapped);
      setCurrentView('all-interns');
    } catch (e) {
      setAllInternsError('Failed to load interns');
      setAllInterns([]);
      setCurrentView('all-interns');
    } finally {
      setLoadingAllInterns(false);
    }
  };

  return (
    <div className="w-full">
      <HeaderBar
        selectedCohort={selectedCohort}
        setSelectedCohort={setSelectedCohort}
        selectedUniversity={selectedUniversity}
        setSelectedUniversity={setSelectedUniversity}
        reportFilter={reportFilter}
        setReportFilter={setReportFilter}
      />

      {currentView === 'dashboard' && (
        <main className="container mx-auto px-4 py-6">
          <div className="flex justify-end mb-4">
            <button onClick={handleViewCohortSummary} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">View Cohort Summary</button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2"><ReportsChart data={weeklyReportsData} totals={reportTotals} /></div>
            <div><ActionItems onSelectIntern={handleInternSelect} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div><TechnologyTrends tech={techTrends} /></div>
            <div className="lg:col-span-2"><SentimentAnalysis riskFlags={riskFlags} /></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
            <div className="lg:col-span-2"><InternLeaderboard interns={leaderboardUsers} onSelectIntern={handleInternSelect} onViewAll={handleViewAllInterns} /></div>
            <div><MetricsOverview metricsLatest={metricsLatestData} /></div>
      </div>
        </main>
      )}

      {currentView === 'intern-details' && selectedIntern && (
        <InternDetails intern={selectedIntern} onBack={handleBackToDashboard} />
      )}

      {currentView === 'cohort-summary' && (
        <CohortSummary cohort={selectedCohort} university={selectedUniversity} onBack={handleBackToDashboard} />
      )}

      {currentView === 'all-interns' && (
        <main className="container mx-auto px-4 py-6">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={handleBackToDashboard} className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded">← Back</button>
            <h2 className="text-xl font-semibold text-white">All Interns</h2>
          </div>
          {loadingAllInterns ? (
            <div className="text-white">Loading...</div>
          ) : allInternsError ? (
            <div className="text-red-400">{allInternsError}</div>
          ) : (
            <InternLeaderboard interns={allInterns} onSelectIntern={handleInternSelect} onViewAll={() => {}} />
          )}
        </main>
      )}
    </div>
  );
};

export default InternshipDashboard;
