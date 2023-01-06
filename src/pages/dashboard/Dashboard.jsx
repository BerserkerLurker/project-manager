import React from "react";

function Dashboard() {
  return (
    <div>
      Dashboard
      <SideNav />
      <Content />
    </div>
  );
}

function SideNav() {
  return <div>SideNav</div>;
}
function Content() {
  return <div>Content</div>;
}

export default Dashboard;
