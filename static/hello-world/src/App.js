import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import WorkFlowAging from "./workflow-aging/WorkFlowAging";


function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    invoke("getText", { example: "my-invoke-variable" }).then(setData);
  }, []);

  const datas = [
  { id: 1, firstName: 'Jon', lastName: 'Snow', age: 35 },
  { id: 2, firstName: 'Arya', lastName: 'Stark', age: 18 },
  { id: 3, firstName: 'Tyrion', lastName: 'Lannister', age: 40 },
];

  return (
    <>
      <div>{data ? data : "Loading..."}</div>
      <WorkFlowAging data={datas} />
    </>
  );
}

export default App;
