import { useState } from "react";
import TeamAlocation from "./team-alocation/TeamAllocation";
import WorkFlowAging from "./workflow-aging/WorkFlowAging";
import WorkFlowForm from "./workflow-aging/WorkFlowForm";
import TeamAllocationForm from "./team-alocation/TeamAllocationForm";

const Home = ({ data }) => {
  const [activeTab, setActiveTab] = useState("team");

  const [workflowFormData, setWorkflowFormData] = useState(null);
  const [teamFormData, setTeamFormData] = useState(null);

  const handleWorkflowSubmit = (submittedData) => {
    setWorkflowFormData(submittedData);
    console.log("Workflow Form Submitted Data:", submittedData);
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
      setActiveTab("team");
      setTeamFormData(null);
    }}
    className={activeTab === "team" ? "tab active-tab" : "tab inactive-tab"}
  >
    Team Allocation
  </button>
  
  <button
    onClick={() => {
      setActiveTab("workflow");
      setWorkflowFormData(null);
    }}
    className={activeTab === "workflow" ? "tab active-tab" : "tab inactive-tab"}
  >
    Workflow Aging
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
