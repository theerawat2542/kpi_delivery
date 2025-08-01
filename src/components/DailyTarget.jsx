import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FFBB28"]; // Completed / On process

function DailyTarget() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const today = new Date();
  const formattedDate = today.toISOString().slice(0, 10);

  useEffect(() => {
    const url = `http://10.35.10.47:2007/api/HtcKpi/KpiDelivery/Delivery/ByModel?Plant=9771&StartDate=${formattedDate}&EndDate=${formattedDate}`;
    // const url = `http://10.35.10.47:2007/api/HtcKpi/KpiDelivery/Delivery/ByModel?Plant=9771&StartDate=2025-07-22&EndDate=2025-07-22`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        const filtered = json.filter((item) => item.target !== null && item.target !== undefined);
        setData(filtered);
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  useEffect(() => {
    if (totalPages === 0) return;
    const interval = setInterval(() => {
      setCurrentPage((prev) => (prev + 1) % totalPages);
    }, 10000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const paginatedData = data.slice(
    currentPage * itemsPerPage,
    currentPage * itemsPerPage + itemsPerPage
  );

  const totalActual = data.reduce(
    (sum, item) => sum + (item.actualDelivery || 0),
    0
  );
  const totalTarget = data.reduce(
    (sum, item) => sum + (item.target || 0),
    0
  );
  let completedPercent = totalTarget ? (totalActual / totalTarget) * 100 : 0;
  if (completedPercent > 100) completedPercent = 100;
  const onProcessPercent = 100 - completedPercent;

  const chartData = [
    { name: "Completed", value: completedPercent },
    { name: "On process", value: onProcessPercent },
  ];

  const handlePrev = () => {
    if (currentPage > 0) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) setCurrentPage(currentPage + 1);
  };

  return (
    <div style={{ display: "flex", padding: "20px" }}>
      <div
        style={{
          width: "100%",
          background: "linear-gradient(145deg, #22334c, #1c273a)",
          borderRadius: "12px",
          padding: "15px",
          color: "#ffffff",
          fontFamily: "Segoe UI, sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: "100%",
            position: "relative",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={75}
                outerRadius={100}
                dataKey="value"
                startAngle={90}
                endAngle={-270}
                isAnimationActive={true}
                animationDuration={1000}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value.toFixed(2)}%`, name]}
                contentStyle={{
                  backgroundColor: "#1c1f26",
                  borderRadius: "10px",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  border: "1px solid #ffffff33",
                  padding: "10px 14px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
                  pointerEvents: "none",
                }}
                itemStyle={{
                  color: "#fff",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
                labelStyle={{ display: "none" }}
                wrapperStyle={{ zIndex: 1000, pointerEvents: "none" }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div
            style={{
              position: "absolute",
              top: "45%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                background: "#f3f3f3ff",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {completedPercent.toFixed(1)}%
            </div>
            <div style={{ fontSize: "14px", color: "#ffffffcc" }}>
              Completed
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              fontSize: "13px",
              color: "#ffffffcc",
            }}
          >
            {chartData.map((entry, index) => (
              <div
                key={index}
                style={{ display: "flex", alignItems: "center", gap: "7px" }}
              >
                <div
                  style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: COLORS[index],
                  }}
                />
                {entry.name}
              </div>
            ))}
          </div>
        </div>

        <h2
          style={{
            textAlign: "center",
            marginBottom: "16px",
            fontWeight: 600,
            fontSize: "18px",
            letterSpacing: "0.5px",
          }}
        >
          📅 Daily Actual with Target ({formattedDate})
        </h2>

        <div style={{ overflowY: "auto", flex: 1, borderRadius: "8px" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "15px",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#2c3e50",
                  position: "sticky",
                  top: 0,
                }}
              >
                <th style={thStyle}>Material Description</th>
                <th style={thStyle}>Target</th>
                <th style={thStyle}>Actual</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "200px" }}>
                    <h2>No data available</h2>
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #727374ff" }}>
                    <td style={tdStyle}>{item.matDesc}</td>
                    <td style={tdStyle}>{item.target ?? 0}</td>
                    <td style={tdStyle}>{item.actualDelivery}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "10px", textAlign: "center" }}>
          <button
            onClick={handlePrev}
            style={buttonStyle}
            disabled={currentPage === 0}
          >
            ⏮ Prev
          </button>
          <span style={{ margin: "0 12px", color: "#ffffffcc" }}>
            Page {currentPage + 1} of {totalPages || 1}
          </span>
          <button
            onClick={handleNext}
            style={buttonStyle}
            disabled={currentPage === totalPages - 1 || totalPages === 0}
          >
            Next ⏭
          </button>
        </div>
      </div>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #3c4c63",
  color: "#ffffff",
  backgroundColor: "#2c3e50",
  zIndex: 1,
};

const tdStyle = {
  padding: "12px 12px",
  color: "#ffffffcc",
};

const buttonStyle = {
  backgroundColor: "#1e2a3a",
  border: "1px solid #334156",
  color: "#ffffffcc",
  padding: "6px 12px",
  borderRadius: "6px",
  cursor: "pointer",
  margin: "0 6px",
};

export default DailyTarget;
