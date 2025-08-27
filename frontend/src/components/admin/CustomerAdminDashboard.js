import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import Sidebar from '../Sidebar';
import DashboardContent from '../DashboardContent';

const CustomerAdminView = () => {
  const location = useLocation();
  const [selectedPage, setSelectedPage] = useState('Cohortdashboard');
  const pages = ['Cohort Dashboard', 'Manager Reports'];

  useEffect(() => {
    const parts = location.pathname.split('/');
    const rawLast = parts[parts.length - 1];
    let last = rawLast && rawLast.length > 0 ? rawLast.toLowerCase() : 'cohortdashboard';
    if (last === 'dashboard') last = 'cohortdashboard';
    const normalized = last.charAt(0).toUpperCase() + last.slice(1);
    setSelectedPage(normalized);
  }, [location.pathname]);

  const handlePageChange = (page) => setSelectedPage(page);

  return (
    <div className='dashboard'>
      <Header userName={'Customer'} />
      <div className='dashboard-container'>
        <Sidebar pages={pages} selectedPage={selectedPage} onboarded={true} isAdmin={true} adminBase={'/admin/customer/cuny2x/dashboard'} />
        <div className='content'>
          <DashboardContent selectedPage={selectedPage} onComplete={(page) => handlePageChange(page)} />
        </div>
      </div>
    </div>
  );
}

export default CustomerAdminView;


