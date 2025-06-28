import React, { useState } from 'react';
import TaskList from './TaskList';
import DataImport from './DataImport';
import './Dashboard.css';

type TabType = 'tasks' | 'import';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>TaskLine SJ - Task Management System</h1>
        <p>Professional task management for legal and corporate services</p>
      </div>

      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Task Dashboard
        </button>
        <button
          className={`tab-button ${activeTab === 'import' ? 'active' : ''}`}
          onClick={() => setActiveTab('import')}
        >
          📤 Import Data
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'tasks' && <TaskList />}
        {activeTab === 'import' && <DataImport />}
      </div>

      <div className="dashboard-footer">
        <p>© 2024 TaskLine SJ. Built with React, TypeScript & Supabase.</p>
      </div>
    </div>
  );
};

export default Dashboard; 