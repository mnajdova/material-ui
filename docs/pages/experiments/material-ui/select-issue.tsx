import * as React from 'react';

function App() {
  return (
    <>
      <div style={{ height: '1000px' }} />
      <iframe style={{
         width: '100vw',
         height: '100vh',
         border: 0,
         overflow: 'hidden',
      }} src="/experiments/material-ui/select-issue-iframe"></iframe>
      <div style={{ height: "1000px" }} />
    </>
  );
}

export default App;
