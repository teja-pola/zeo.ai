import React, { useEffect, useState } from 'react';
import StudentSidebar from './StudentSidebar';
import CounsellorSidebar from './CounsellorSidebar';

const DashboardSidebar: React.FC = () => {
  const [userType, setUserType] = useState<string>('');

  useEffect(() => {
    // Get user type from localStorage
    const userTypeData = localStorage.getItem('userType');
    if (userTypeData) {
      setUserType(userTypeData);
    }
  }, []);

  // Render appropriate sidebar based on user type
  if (userType === 'counsellor') {
    return <CounsellorSidebar />;
  } else {
    return <StudentSidebar />;
  }
};

export default DashboardSidebar;