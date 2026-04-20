import { useEffect, useState } from "react";
import "../assets/css/dashboard.css";

const API_BASE = "http://localhost:5000/api/application";

export default function Dashboard() {
  const [applications, setApplications] = useState([]);

  const [filters, setFilters] = useState({
    country: "",
    status: "",
    method: "",
  });

  const [filterOptions, setFilterOptions] = useState({
    countries: [],
    status: [],
    method: [],
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    universityName: "",
    programName: "",
    country: "",
    applicationMethod: "PORTAL",
    applicationDate: "",
    status: "NOT_APPLIED",
    contactEmail: "",
    note: "",
  });

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) window.location.href = "/login";

    init();
  }, []);

  async function init() {
    await Promise.all([fetchFilters(), fetchApplications()]);
  }

  
  async function fetchFilters() {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/filters`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return logout();

    const data = await res.json();
    const obj = data.filters || data.data || data;

    setFilterOptions({
      countries: obj.countries || [],
      status: obj.status || [],
      method: obj.method || [],
    });
  }


  async function fetchApplications(query = "") {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/me${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return logout();

    const data = await res.json();

    if (Array.isArray(data)) setApplications(data);
    else if (Array.isArray(data.applications)) setApplications(data.applications);
    else if (Array.isArray(data.data)) setApplications(data.data);
    else setApplications([]);
  }


  function applyFilters() {
    const params = new URLSearchParams();

    if (filters.country) params.append("country", filters.country);
    if (filters.status) params.append("status", filters.status);
    if (filters.method) params.append("method", filters.method);

    fetchApplications("?" + params.toString());
  }

 
  function openCreateModal() {
    setEditingId(null);
    setForm({
      universityName: "",
      programName: "",
      country: "",
      applicationMethod: "PORTAL",
      applicationDate: "",
      status: "NOT_APPLIED",
      contactEmail: "",
      note: "",
    });

    setIsModalOpen(true);
  }

  function openEditModal(app) {
    setEditingId(app._id);

    setForm({
      universityName: app.universityName || "",
      programName: app.programName || "",
      country: app.country || "",
      applicationMethod: app.applicationMethod || "PORTAL",
      applicationDate: app.applicationDate
        ? app.applicationDate.split("T")[0]
        : "",
      status: app.status || "NOT_APPLIED",
      contactEmail: app.contactEmail || "",
      note: app.note || "",
    });

    setIsModalOpen(true);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  
  async function handleSubmit(e) {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const isEdit = !!editingId;

    const url = isEdit
      ? `${API_BASE}/${editingId}`
      : `${API_BASE}/create`;

    const method = isEdit ? "PATCH" : "POST";

    const payload = {
      universityName: form.universityName,
      programName: form.programName,
      country: form.country,
      applicationMethod: form.applicationMethod,
      applicationDate: form.applicationDate,
      status: form.status,
      ...(form.contactEmail && { contactEmail: form.contactEmail }),
      ...(form.note && { note: form.note }),
    };

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) return logout();

    if (!res.ok) {
      alert("Failed to save application");
      return;
    }

    setIsModalOpen(false);
    fetchApplications();
  }

  
  async function deleteApp(id) {
    if (!confirm("Delete this application?")) return;

    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) return logout();

    if (!res.ok) {
      alert("Delete failed");
      return;
    }

    fetchApplications();
  }

  function logout() {
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  
  return (
    <div className="dashboard-container">
      <main className="main-content">

      
        <header className="topbar">
          <h1>Applications</h1>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button className="btn-primary" onClick={openCreateModal}>
              + New Application
            </button>

            <button className="btn-apply" onClick={logout}>
              Logout
            </button>
          </div>
        </header>

        
        <section className="filters">
          <select
            value={filters.country}
            onChange={(e) =>
              setFilters({ ...filters, country: e.target.value })
            }
          >
            <option value="">All Countries</option>
            {filterOptions.countries.map((c, i) => (
              <option key={i} value={c._id || c}>
                {c._id || c}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
          >
            <option value="">All Statuses</option>
            {filterOptions.status.map((s, i) => (
              <option key={i} value={s._id || s}>
                {s._id || s}
              </option>
            ))}
          </select>

          <select
            value={filters.method}
            onChange={(e) =>
              setFilters({ ...filters, method: e.target.value })
            }
          >
            <option value="">All Methods</option>
            {filterOptions.method.map((m, i) => (
              <option key={i} value={m._id || m}>
                {m._id || m}
              </option>
            ))}
          </select>

          <button className="btn-apply" onClick={applyFilters}>
            Apply Filters
          </button>
        </section>

        
        <section className="data">
          <table>
            <thead>
              <tr>
                <th>University</th>
                <th>Program</th>
                <th>Country</th>
                <th>Method</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    No applications found
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.universityName}</td>
                    <td>{app.programName}</td>
                    <td>{app.country}</td>
                    <td>{app.applicationMethod}</td>
                    <td>
                      {app.applicationDate
                        ? new Date(app.applicationDate).toLocaleDateString()
                        : ""}
                    </td>

                    <td>
                      <span className={`status ${app.status?.toLowerCase()}`}>
                        {app.status?.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td>
                      <button
                        className="action-btn"
                        onClick={() => openEditModal(app)}
                      >
                        Edit
                      </button>

                      <button
                        className="action-btn"
                        onClick={() => deleteApp(app._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      </main>

      
      {isModalOpen && (
        <div className="modal-overlay active">
          <div className="modal-content">
            <h2>
              {editingId ? "Edit Application" : "Add New Application"}
            </h2>

            <form onSubmit={handleSubmit} id="createAppForm">

              <div className="form-grid">

                <div className="form-group">
                  <label>University Name *</label>
                  <input
                    name="universityName"
                    value={form.universityName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Country *</label>
                  <input
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Program Name *</label>
                  <input
                    name="programName"
                    value={form.programName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    name="contactEmail"
                    value={form.contactEmail}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Deadline *</label>
                  <input
                    type="date"
                    name="applicationDate"
                    value={form.applicationDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Method *</label>
                  <select
                    name="applicationMethod"
                    value={form.applicationMethod}
                    onChange={handleChange}
                  >
                    <option value="PORTAL">Portal</option>
                    <option value="EMAIL">Email</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="NOT_APPLIED">Not Applied</option>
                    <option value="EMAIL_SENT">Email Sent</option>
                    <option value="APPLIED_PORTAL">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="ACCEPTED">Accepted</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    name="note"
                    value={form.note}
                    onChange={handleChange}
                  />
                </div>

              </div>

              <button className="btn-primary modal-btn" type="submit">
                {editingId ? "Update" : "Create"}
              </button>

              <button
                type="button"
                className="btn-apply"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}