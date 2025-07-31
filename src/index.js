import Resolver from '@forge/resolver';
import api, { route } from '@forge/api';

const resolver = new Resolver();
resolver.define('getIssues', async (req) => {
  const { projectKey } = req.payload;

    try {
        const response = await api.asApp().requestJira(route
            `/rest/api/3/search?jql=project=${projectKey}&maxResults=100`,
            {
                headers: {
                    'Accept': 'application/json',
                }
            }
        );
        
        const data = await response.json();
        return data.issues || [];
    } catch (error) {
        console.error('Error fetching issues:', error);
        throw new Error('Failed to fetch issues');
    }
});

resolver.define('getIssueById', async (req) => {
  const { IssueId } = req.payload;

  try {
    const response = await api.asApp().requestJira(route`
      /rest/api/3/issue/${IssueId}`,
      {
        headers: { 'Accept': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching issue: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    throw new Error('Failed to fetch issue by ID');
  }
});
resolver.define('getIssueLogById', async (req) => {
  const { IssueId } = req.payload;

  try {
    const response = await api.asApp().requestJira(route`
      /rest/api/3/issue/${IssueId}/changelog`,
      {
        headers: { 'Accept': 'application/json' },
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching issue: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    throw new Error('Failed to fetch issue by ID');
  }
});

resolver.define('getIssueLogById', async (req) => {
  const { IssueId } = req.payload;

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/issue/${IssueId}/changelog`, {
      headers: { 'Accept': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Error fetching issue: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching issue by ID:', error);
    throw new Error('Failed to fetch issue by ID');
  }
});


export const handler = resolver.getDefinitions();
