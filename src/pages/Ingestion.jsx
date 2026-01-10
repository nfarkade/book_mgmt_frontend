import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Ingestion() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState("");
  const [stats, setStats] = useState({
    totalDocuments: 0,
    processedToday: 0,
    failedJobs: 0
  });

  useEffect(() => {
    loadIngestionData();
  }, []);

  const loadIngestionData = async () => {
    console.log('Loading ingestion data...');
    try {
      // Try to get documents first to show ingestion options
      const documentsResponse = await api.get("/documents");
      const documentsData = documentsResponse.data || [];
      setDocuments(documentsData);
      
      // Get today's processed count from backend
      let processedToday = 0;
      try {
        const todayCountResponse = await api.get("/ingestion/today-count");
        processedToday = todayCountResponse.data.today_processed || 0;
        console.log('Today processed from API:', processedToday);
      } catch (error) {
        console.log('Failed to get today count, will calculate from jobs');
      }
      
      // Create jobs from documents with status checks
      const jobPromises = documentsData.slice(0, 5).map(async (doc) => {
        try {
          console.log(`Checking status for document ${doc.id}`);
          const statusResponse = await api.get(`/ingestion/status/${doc.id}`);
          console.log(`Status response for doc ${doc.id}:`, statusResponse.data);
          
          const status = statusResponse.data.status || 'pending';
          let progress = 0;
          
          switch(status.toLowerCase()) {
            case 'completed':
            case 'success':
              progress = 100;
              break;
            case 'running':
            case 'processing':
            case 'in_progress':
              progress = 75;
              break;
            case 'failed':
            case 'error':
              progress = 0;
              break;
            default:
              progress = 0;
          }
          
          return {
            id: doc.id,
            name: `Processing ${doc.filename}`,
            status: status,
            progress: progress,
            startTime: new Date(doc.uploaded_at).toLocaleString()
          };
        } catch (error) {
          console.log(`Status check failed for doc ${doc.id}:`, error.response?.status);
          // If status endpoint doesn't exist or fails, show as not started
          return {
            id: doc.id,
            name: `Processing ${doc.filename}`,
            status: 'not_started',
            progress: 0,
            startTime: new Date(doc.uploaded_at).toLocaleString()
          };
        }
      });
      
      const jobs = await Promise.all(jobPromises);
      setJobs(jobs);
      
      // Calculate stats from documents and jobs
      const totalDocs = documentsData.length;
      const failedJobs = jobs.filter(job => job.status === 'failed' || job.status === 'error').length;
      
      setStats({ 
        totalDocuments: totalDocs, 
        processedToday: processedToday, 
        failedJobs: failedJobs 
      });
      
    } catch (error) {
      console.error("Failed to load ingestion data:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      // Keep mock data as fallback
      setJobs([
        { id: 1, name: "PDF Processing", status: "Running", progress: 75, startTime: "2024-01-15 10:30" },
        { id: 2, name: "Text Extraction", status: "Completed", progress: 100, startTime: "2024-01-15 09:15" },
        { id: 3, name: "Index Building", status: "Failed", progress: 45, startTime: "2024-01-15 08:00" }
      ]);
      setStats({ totalDocuments: 1234, processedToday: 56, failedJobs: 3 });
    }
  };

  const startIngestion = async () => {
    if (!selectedDocument) {
      alert("Please select a document to ingest");
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.post(`/ingestion/trigger/${selectedDocument}`);
      console.log('Ingestion response:', response.data);
      alert(`Ingestion started for document. Job ID: ${response.data.job_id}`);
      await loadIngestionData(); // Refresh data
    } catch (error) {
      console.error("Failed to start ingestion:", error);
      alert('Failed to start ingestion. Backend endpoint not available.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <div className="page-header">
          <h2>Data Ingestion</h2>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <select
              value={selectedDocument}
              onChange={(e) => setSelectedDocument(e.target.value)}
              className="form-control"
              style={{minWidth: '200px'}}
            >
              <option value="">Select document...</option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.filename}
                </option>
              ))}
            </select>
            <button 
              className="btn btn-primary" 
              onClick={startIngestion}
              disabled={loading || !selectedDocument}
            >
              {loading ? 'Starting...' : 'Start Ingestion'}
            </button>
          </div>
        </div>

        <div className="ingestion-stats">
          <div className="stat-card">
            <h4>Total Documents</h4>
            <span className="stat-number">{stats.totalDocuments.toLocaleString()}</span>
          </div>
          <div className="stat-card">
            <h4>Processed Today</h4>
            <span className="stat-number">{stats.processedToday}</span>
          </div>
          <div className="stat-card">
            <h4>Failed Jobs</h4>
            <span className="stat-number">{stats.failedJobs}</span>
          </div>
        </div>

        <div className="jobs-section">
          <h3>Recent Jobs</h3>
          {jobs.map(job => (
            <div key={job.id} className="job-item">
              <div className="job-info">
                <h4>{job.name}</h4>
                <p>Started: {job.startTime}</p>
              </div>
              <div className="job-status">
                <span className={`status-badge ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${job.progress}%`}}
                  ></div>
                </div>
                <span className="progress-text">{job.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}