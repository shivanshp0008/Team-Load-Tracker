import { useState } from "react";
import TeamAlocation from "./team-alocation/TeamAlocation";
import WorkFlowAging from "./workflow-aging/WorkFlowAging";

const Home = ({ data }) => {
  const [activeTab, setActiveTab] = useState('workflow');

  return (
    <>
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('workflow')}>Workflow Aging</button>
        <button onClick={() => setActiveTab('team')}>Team Allocation</button>
      </div>

      {activeTab === 'workflow' && <WorkFlowAging data={data} />}
      {activeTab === 'team' && <TeamAlocation />}
    </>
  );
};

export default Home;
