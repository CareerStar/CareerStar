import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Spinner
} from 'react-bootstrap';

const ActivityManagement = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'activityId', direction: 'ascending' });
  
  // Activity name mapping
  const activityNames = {
    1: "Reaching out to more than Recruiters",
    2: "Career Acronym Challenge",
    3: "Better Cold Call LinkedIn Messages",
    4: "Hot Jobs of the Week!",
    5: "Let’s Network Before We Network",
    7: "The Dreaded Salary Talk",
    8: "Presenting Your Portfolio",
    9: "Networking Made Easy: Finding Your Events",
    10: "The 10% Coffee Challenge",
    11: "Unlock Your Volunteer Superpowers!",
    13: "3-2-1 + Report: Stand Out During Your Internship",
    14: "Mock Interview Jeopardy",
    15: "Tell us about your internship"
  };

  const admin_token = localStorage.getItem('admin_token') || '';

  const headers = {
    Authorization: `Bearer ${admin_token}`,
    'Content-Type': 'application/json',
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      // You'll need to replace this with your actual API endpoint
      const response = await axios.get('https://api.careerstar.co/roadmapactivity', { headers });
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load activity data. Please try again later.');
      console.error('Error fetching activities:', err);
      
    } finally {
      setLoading(false);
    }
  };

  // Sorting function
  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Get sort direction indicator
  const getSortDirectionIndicator = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
  };

  // Apply sorting and filtering to activities
  const filteredAndSortedActivities = React.useMemo(() => {
    // First enrich activities with name
    let enrichedActivities = activities.map(activity => ({
      ...activity,
      name: activityNames[activity.activityId] || `Activity ${activity.activityId}`
    }));
    
    // Apply search filter
    let filteredActivities = enrichedActivities.filter(activity => {
      const activityName = activity.name.toLowerCase();
      const term = searchTerm.toLowerCase();
      return activityName.includes(term) || activity.activityId.toString().includes(term);
    });
    
    // Sort activities
    let sortedActivities = [...filteredActivities];
    if (sortConfig.key !== null) {
      sortedActivities.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortedActivities;
  }, [activities, searchTerm, sortConfig]);

  // IDs from Roadmap.js (except 13, which is handled specially)
  const roadmapActivityIds = [1, 2, 3, 5, 7, 9, 10, 11, 14,15];

  // Group and sum for Activity 13
  const activity13Counts = activities
    .filter(a => String(a.activityId).startsWith('13'))
    .reduce((sum, a) => sum + a.count, 0);

  // Filter for other roadmap activities
  const filteredActivities = activities
    .filter(a => roadmapActivityIds.includes(Number(a.activityId)))
    .map(a => ({
      ...a,
      name: activityNames[a.activityId] || `Activity ${a.activityId}`
    }));

  // Add Activity 13 as a single entry
  const displayActivities = [
    ...filteredActivities,
    {
      activityId: '13',
      name: '3-2-1 + Report: Stand Out During Your Internship',
      count: activity13Counts
    }
  ];

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="container mx-auto pr-[7rem] pl-0 pt-0 py-8 max-w-[85em] mt-[1rem]">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">Activity Management</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
              <p>{error}</p>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search by activity name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              />
            </div>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('activityId')}
                  >
                    Activity ID {getSortDirectionIndicator('activityId')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('name')}
                  >
                    Activity Name {getSortDirectionIndicator('name')}
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => requestSort('count')}
                  >
                    Completion Count {getSortDirectionIndicator('count')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {displayActivities.length > 0 ? (
                  displayActivities.map(activity => (
                    <tr key={activity.activityId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {activity.activityId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {activity.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm font-medium mr-2">{activity.count}</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-blue-600 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (activity.count / Math.max(...activities.map(a => a.count))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                      {searchTerm ? 'No activities match your search.' : 'No activities found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Activity Completion Visualization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium mb-3">Most Completed Activities</h4>
                <div className="space-y-3">
                  {[...displayActivities]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 5)
                    .map(activity => (
                      <div key={`top-${activity.activityId}`} className="flex items-center">
                        <div className="w-40 text-sm truncate">{activity.name}</div>
                        <div className="flex-grow mx-2">
                          <div className="bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-green-500 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (activity.count / Math.max(...activities.map(a => a.count))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium w-10 text-right">{activity.count}</div>
                      </div>
                    ))}
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-md font-medium mb-3">Least Completed Activities</h4>
                <div className="space-y-3">
                  {[...displayActivities]
                    .sort((a, b) => a.count - b.count)
                    .slice(0, 5)
                    .map(activity => (
                      <div key={`bottom-${activity.activityId}`} className="flex items-center">
                        <div className="w-40 text-sm truncate">{activity.name}</div>
                        <div className="flex-grow mx-2">
                          <div className="bg-gray-200 rounded-full h-2.5">
                            <div 
                              className="bg-red-400 h-2.5 rounded-full" 
                              style={{ width: `${Math.min(100, (activity.count / Math.max(...activities.map(a => a.count))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm font-medium w-10 text-right">{activity.count}</div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ActivityManagement;