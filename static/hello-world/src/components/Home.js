import { useState } from "react";
import TeamAlocation from "./team-alocation/TeamAlocation";
import WorkFlowAging from "./workflow-aging/WorkFlowAging";
import WorkFlowForm from "./workflow-aging/WorkFlowForm";
import TeamAllocationForm from "./team-alocation/TeamAllocationForm";

const Home = ({ data }) => {
  const [activeTab, setActiveTab] = useState("team");

  const [workflowFormData, setWorkflowFormData] = useState(null);
  const [teamFormData, setTeamFormData] = useState(null);

  const handleWorkflowSubmit = (submittedData) => {
    setWorkflowFormData(submittedData);
  };

  const handleTeamSubmit = (submittedData) => {
    setTeamFormData(submittedData);
  };

  const handleWorkflowBack = () => {
    setWorkflowFormData(null);
  };

  const handleTeamBack = () => {
    setTeamFormData(null);
  };

  return (
    <>
      <div className="tab-buttons">
        <button
          onClick={() => {
            setActiveTab("workflow");
            setWorkflowFormData(null);
          }}
        >
          Workflow Aging
        </button>
        <button
          onClick={() => {
            setActiveTab("team");
            setTeamFormData(null);
          }}
        >
          Team Allocation
        </button>
      </div>

      {activeTab === "workflow" && !workflowFormData && (
        <WorkFlowForm data={data} onSubmit={handleWorkflowSubmit} />
      )}
      {activeTab === "workflow" && workflowFormData && (
        <WorkFlowAging
          data={data}
          filters={workflowFormData}
          onBack={handleWorkflowBack}
        />
      )}

      {activeTab === "team" && !teamFormData && (
        <TeamAllocationForm data={data} onSubmit={handleTeamSubmit} />
      )}
      {activeTab === "team" && teamFormData && (
        <TeamAlocation
          data={data}
          filters={teamFormData}
          onBack={handleTeamBack}
        />
      )}
    </>
  );
};

export default Home;
