import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import './TaskList.css';

interface Task {
  "S.No.": number;
  "Entity Name": string;
  "Billing": number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ "S.No.": '', "Entity Name": '', Billing: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('taska')
        .select('*');
      console.log('Fetched data:', data, 'Error:', error);
      if (error) {
        setError(error.message);
      } else {
        setTasks(data as Task[]);
      }
    } catch (err) {
      setError('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    // Validate
    if (!form["S.No."] || !form["Entity Name"] || !form.Billing) {
      setFormError('All fields are required.');
      setSubmitting(false);
      return;
    }
    const newTask = {
      "S.No.": Number(form["S.No."] ?? 0),
      "Entity Name": form["Entity Name"],
      "Billing": Number(form.Billing ?? 0),
    };
    try {
      const { error } = await supabase.from('taska').insert([newTask]);
      if (error) {
        setFormError(error.message);
      } else {
        setShowForm(false);
        setForm({ "S.No.": '', "Entity Name": '', Billing: '' });
        fetchTasks();
      }
    } catch (err) {
      setFormError('Failed to add task.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="loading-spinner"></div><p>Loading tasks...</p></div>;
  if (error) return <div className="error-container"><h3>Error</h3><p>{error}</p></div>;

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h2>Task List</h2>
        <button className="add-task-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Task'}
        </button>
      </div>
      {showForm && (
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="number"
            name="S.No."
            placeholder="S.No."
            value={form["S.No."]}
            onChange={handleInputChange}
            min="1"
            required
          />
          <input
            type="text"
            name="Entity Name"
            placeholder="Entity Name"
            value={form["Entity Name"]}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="Billing"
            placeholder="Billing"
            value={form.Billing}
            onChange={handleInputChange}
            min="0"
            required
          />
          <button type="submit" disabled={submitting}>{submitting ? 'Adding...' : 'Add Task'}</button>
          {formError && <div className="form-error">{formError}</div>}
        </form>
      )}
      <div className="table-container">
        <table className="task-table">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Entity Name</th>
              <th>Billing</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task["S.No."]} className="task-row">
                <td>{task["S.No."]}</td>
                <td>{task["Entity Name"]}</td>
                <td>{task["Billing"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks found. Please check your database connection or add some tasks.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList; 