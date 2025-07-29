import React, { useEffect, useState } from 'react';
import { invoke, view } from '@forge/bridge';

// Helper function to extract plain text from ADF
const safeText = (field) => {
  if (typeof field === 'string') return field;
  try {
    return field?.content?.[0]?.content?.[0]?.text || '[Unsupported Format]';
  } catch {
    return '[Unsupported Format]';
  }
};

function App() {
  const [projectKey, setProjectKey] = useState(null);
  const [allIssues, setAllIssues] = useState([]);
  const [issue, setIssue] = useState(null);

  useEffect(() => {
    const fetchContext = async () => {
      const context = await view.getContext();
      const key = context?.extension?.project?.key;
      console.log('Forge Context:', context);
      console.log('Project Key:', key);

      setProjectKey(key);
      await invoke('getProjectKey', { projectKey: key });

      try {
        const issues = await invoke('getIssues', { projectKey: key });
        setAllIssues(issues);
        console.log('Issues:', issues);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setAllIssues([]);
      }
    };

    fetchContext();
  }, []);

  const getIssueId = async (id) => {
    try {
      const issue = await invoke('getIssuesById', { IssueId: id });
      setIssue(issue);
      console.log('Selected Issue ID:', id);
      console.log('Selected Issue:', issue);
    } catch (error) {
      console.error('Failed to get issue by ID:', error);
    }
  };

  return (
    <>
      {!issue ? (
        allIssues.length > 0 ? (
          allIssues.map((issue) => (
            <div key={issue.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{safeText(issue.fields.summary)}</h3>
              <p>Status: {issue.fields.status.name}</p>
              <p>Assignee: {issue.fields.assignee?.displayName || 'Unassigned'}</p>
              <button onClick={() => getIssueId(issue.id)}>
                View Details
              </button>
            </div>
          ))
        ) : (
          <p>Loading issues...</p>
        )
      ) : (
        <div>
          <button onClick={() => setIssue(null)}>⬅ Back to Issue List</button>
          <h2>Issue Details</h2>
          <p><strong>Key:</strong> {issue.key}</p>
          <p><strong>Summary:</strong> {safeText(issue.fields.summary)}</p>
          <p><strong>Description:</strong> {safeText(issue.fields.description)}</p>
          <p><strong>Status:</strong> {issue.fields.status.name}</p>
          <p><strong>Assignee:</strong> {issue.fields.assignee?.displayName || 'Unassigned'}</p>
        </div>
      )}
    </>
  );
}

export default App;
