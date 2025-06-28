import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import './DataImport.css';

interface CSVRow {
  id: string;
  name: string;
  resource: string;
  entity_group: string;
  entity: string;
  state: string;
  task: string;
  tribunal_court: string;
  billing: string;
  reminder: string;
  others: string;
  fees: string;
  misc: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

const DataImport: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map(h => h.replace(/"/g, ''));
    const rows: CSVRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim()) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, ''));
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row as CSVRow);
      }
    }

    return rows;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFile(file);
    setMessage('');
    setImportedCount(0);
  };

  const importData = async () => {
    if (!file) {
      setMessage('Please select a CSV file first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const text = await file.text();
      const csvData = parseCSV(text);
      
      let successCount = 0;
      let errorCount = 0;

      for (const row of csvData) {
        try {
          const { error } = await supabase
            .from('tasks')
            .insert({
              id: parseInt(row.id),
              name: row.name,
              resource: row.resource,
              entity_group: row.entity_group,
              entity: row.entity,
              state: row.state,
              task: row.task,
              tribunal_court: row.tribunal_court,
              billing: row.billing,
              reminder: row.reminder,
              others: row.others,
              fees: row.fees,
              misc: row.misc,
              status: row.status,
              due_date: row.due_date,
              created_at: row.created_at,
              updated_at: row.updated_at
            });

          if (error) {
            console.error('Error inserting row:', error);
            errorCount++;
          } else {
            successCount++;
          }
        } catch (err) {
          console.error('Error processing row:', err);
          errorCount++;
        }
      }

      setImportedCount(successCount);
      setMessage(`Import completed! ${successCount} records imported successfully. ${errorCount} errors.`);
    } catch (error) {
      console.error('Import error:', error);
      setMessage('Error importing data. Please check the file format.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="data-import-container">
      <h3>Import CSV Data</h3>
      
      <div className="import-section">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="file-input"
        />
        
        {file && (
          <div className="file-info">
            <p>Selected file: {file.name}</p>
            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>
        )}
        
        <button
          onClick={importData}
          disabled={!file || loading}
          className="import-button"
        >
          {loading ? 'Importing...' : 'Import Data'}
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {importedCount > 0 && (
        <div className="import-summary">
          <p>Successfully imported {importedCount} records!</p>
        </div>
      )}

      <div className="instructions">
        <h4>Instructions:</h4>
        <ul>
          <li>Upload a CSV file with the correct column structure</li>
          <li>Make sure your Supabase table 'tasks' exists with the right schema</li>
          <li>The CSV should have headers matching the database columns</li>
          <li>Date fields should be in YYYY-MM-DD format</li>
        </ul>
      </div>
    </div>
  );
};

export default DataImport; 