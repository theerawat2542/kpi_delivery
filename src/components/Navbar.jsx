import "./Navbar.css";
import {
  FaDownload,
  FaFileImport,
  FaEye,
  FaEyeSlash,
  FaBullseye,
  FaTable,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ เพิ่มตัวนี้

function Navbar() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTools, setShowTools] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate(); // ✅ ใช้งาน useNavigate

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      setSelectedFile(file);
    } else {
      alert("Please upload a valid CSV file.");
      setSelectedFile(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a CSV file first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "http://10.35.10.47:2007/api/HtcKpi/KpiDelivery/ImportTarget",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("File uploaded successfully!");
        setSelectedFile(null);
      } else {
        const errorText = await response.text();
        alert(`Upload failed: ${errorText}`);
      }
    } catch (error) {
      alert(`Error uploading file: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // ✅ ฟังก์ชันนำทาง
  const goToAllData = () => navigate("/");
  const goToTarget = () => navigate("/target");

  return (
    <nav className="navbar">
      <div className="navbar-left">KPI Delivery</div>

      <div className="navbar-right">
        <button
          className="toggle-tools-btn"
          onClick={() => setShowTools(!showTools)}
          title={showTools ? "Hide Tools" : "Show Tools"}
        >
          {showTools ? <FaEyeSlash /> : <FaEye />}
        </button>

        {showTools && (
          <>
            <div className="import-box">
              <label className="import-btn">
                <FaFileImport style={{ marginRight: "4px" }} />
                Import Target File
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImport}
                  style={{ display: "none" }}
                  disabled={uploading}
                />
              </label>

              {selectedFile && (
                <span className="file-name" title={selectedFile.name}>
                  {selectedFile.name}
                </span>
              )}

              <button
                className="upload-btn"
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>

            <a
              href="/Kpi_Delivery_Template.csv"
              download
              className="download-icon"
              title="Download Template"
            >
              <FaDownload size={14} style={{ marginRight: "4px" }} />
              Template
            </a>

            {/* ✅ ปุ่มที่นำทาง */}
            <button className="icon-btn" title="All Data" onClick={goToAllData}>
              <FaTable />
            </button>

            <button className="icon-btn" title="Target" onClick={goToTarget}>
              <FaBullseye />
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
