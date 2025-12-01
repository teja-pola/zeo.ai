// Utility functions for testing role-adaptive sidebar functionality

export const setUserRole = (role: 'student' | 'counsellor') => {
  localStorage.setItem('userRole', role);
  
  // Also set mock user data
  const mockUser = {
    fullName: role === 'counsellor' ? 'Dr. Sarah Wilson' : 'John Student',
    email: role === 'counsellor' ? 'sarah.wilson@zeo.ai' : 'john.student@email.com',
    role: role
  };
  
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  // Reload the page to see changes
  window.location.reload();
};

export const getCurrentRole = (): 'student' | 'counsellor' => {
  return (localStorage.getItem('userRole') as 'student' | 'counsellor') || 'student';
};

export const toggleRole = () => {
  const currentRole = getCurrentRole();
  const newRole = currentRole === 'student' ? 'counsellor' : 'student';
  setUserRole(newRole);
};

// Add this to window for easy testing in browser console
declare global {
  interface Window {
    roleTestHelper: {
      setUserRole: typeof setUserRole;
      getCurrentRole: typeof getCurrentRole;
      toggleRole: typeof toggleRole;
    };
  }
}

if (typeof window !== 'undefined') {
  window.roleTestHelper = {
    setUserRole,
    getCurrentRole,
    toggleRole
  };
}

