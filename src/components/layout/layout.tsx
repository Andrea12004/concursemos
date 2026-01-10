import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div className='all-dashboard'>
      <Sidebar />
      
      <div className='content-dashboard'>
        <Header setSearchQuery={setSearchQuery} />
          {children}
      </div>
    </div>
  );
};

export default Layout;