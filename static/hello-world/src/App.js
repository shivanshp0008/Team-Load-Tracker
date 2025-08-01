import React, { useEffect, useState } from 'react';
import { invoke, view } from '@forge/bridge';
import Home from './components/Home';


function App() {
  // const [projectKey, setProjectKey] = useState(null);
  const [allIssues, setAllIssues] = useState([]);

  useEffect(() => {
    const fetchContext = async () => {
      const context = await view.getContext();
      const key = context?.extension?.project?.key;
      console.log('Forge Context:', context);
      console.log('Project Key:', key);

      // setProjectKey(key);
      // await invoke('getProjectKey', { projectKey: key });

      try {
        const issues = await invoke('getIssues', { projectKey: key });
        setAllIssues(issues);
        console.log('Fetched Issues:', issues);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setAllIssues([]);
      }
    };

    fetchContext();
  }, []);

  return (
    <>
      <Home data={Array.isArray(allIssues) ? allIssues : []} />
      
    </>
  );
}

export default App;
