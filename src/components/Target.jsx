// App.jsx
import DailyTarget from "./DailyTarget";
import MonthlyTarget from "./MonthlyTarget";
import Navbar from "./Navbar";
import "/src/App.css";

function Target() {
  return (
    <div className="app-container">
      <Navbar />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "20px",
        }}
      >
        <div style={{ flex: 2 }}><MonthlyTarget /></div>
        <div style={{ flex: 1 }}><DailyTarget /></div>
      </div>
    </div>
  );
}

export default Target;
