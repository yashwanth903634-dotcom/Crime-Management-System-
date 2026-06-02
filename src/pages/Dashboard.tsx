import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../components/Card';
import { Table, type Column } from '../components/Table';
import { ShieldAlert, Server, Activity, Users, Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Download, LogOut, UserCircle, AlertTriangle, Clock } from 'lucide-react';
import { CriminalForm } from '../components/CriminalForm';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [criminals, setCriminals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState<any>(null);

  // Dashboard stats from MySQL
  const [stats, setStats] = useState({
    total: 0,
    active_cases: 0,
    wanted: 0,
    captured: 0,
    deceased: 0,
  });

  // Live activity from real CRUD operations
  const [activities, setActivities] = useState<any[]>([]);

  // Search, Sort, Pagination States
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch all data from MySQL
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [criminalsRes, statsRes, activitiesRes] = await Promise.all([
        api.get('/criminals'),
        api.get('/criminals/stats'),
        api.get('/activities/recent?limit=10'),
      ]);
      setCriminals(criminalsRes.data);
      setStats({
        total: statsRes.data.total || 0,
        active_cases: statsRes.data.active_cases || 0,
        wanted: statsRes.data.wanted || 0,
        captured: statsRes.data.captured || 0,
        deceased: statsRes.data.deceased || 0,
      });
      setActivities(activitiesRes.data);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(err.response?.data?.error ? `${err.response.data.message}: ${err.response.data.error}` : err.response?.data?.message || 'Failed to fetch data from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFormSubmit = async (formData: FormData) => {
    try {
      if (editingData) {
        await api.put(`/criminals/${editingData.id}`, formData);
      } else {
        await api.post('/criminals', formData);
      }
      setShowForm(false);
      setEditingData(null);
      // Refresh all data after CRUD operation
      fetchData();
    } catch (err: any) {
      console.error('Error saving record:', err);
      const errorMsg = err.response?.data?.error ? `${err.response.data.message}: ${err.response.data.error}` : err.response?.data?.message || 'Error saving record';
      alert(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this record? This action cannot be undone.')) return;
    try {
      await api.delete(`/criminals/${id}`);
      // Refresh all data after delete
      fetchData();
    } catch (err: any) {
      console.error('Error deleting record:', err);
      const errorMsg = err.response?.data?.error ? `${err.response.data.message}: ${err.response.data.error}` : err.response?.data?.message || 'Error deleting record';
      alert(errorMsg);
    }
  };

  const handleEdit = (row: any) => {
    setEditingData(row);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Export CSV from real data
  const exportToCSV = () => {
    if (criminals.length === 0) {
      alert("No data to export. Add criminal records first.");
      return;
    }

    const exportHeaders = [
      'ID', 'Case ID', 'Criminal ID', 'Criminal Name', 'Nickname', 'Crime Type',
      'Father Name', 'Gender', 'Arrest Date', 'Crime Date', 'Address', 'Age',
      'Occupation', 'Birth Mark', 'Police Station', 'Status'
    ];
    const exportKeys = [
      'id', 'case_id', 'criminal_id', 'criminal_name', 'nickname', 'crime_type',
      'father_name', 'gender', 'arrest_date', 'crime_date', 'address', 'age',
      'occupation', 'birth_mark', 'police_station', 'status'
    ];

    const csvRows = [];
    csvRows.push(exportHeaders.join(','));

    for (const row of criminals) {
      const values = exportKeys.map(key => {
        let val = row[key] ?? '';
        if (key === 'arrest_date' || key === 'crime_date') {
          val = val ? new Date(val).toLocaleDateString() : '';
        }
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', `criminals_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Process data: Filter -> Sort -> Paginate
  const processedData = useMemo(() => {
    let filteredData = [...criminals];

    if (searchTerm) {
      const lowercasedSearch = searchTerm.toLowerCase();
      filteredData = filteredData.filter(item =>
        (item.criminal_name && item.criminal_name.toLowerCase().includes(lowercasedSearch)) ||
        (item.nickname && item.nickname.toLowerCase().includes(lowercasedSearch)) ||
        (item.criminal_id && item.criminal_id.toLowerCase().includes(lowercasedSearch)) ||
        (item.case_id && item.case_id.toLowerCase().includes(lowercasedSearch)) ||
        (item.crime_type && item.crime_type.toLowerCase().includes(lowercasedSearch)) ||
        (item.police_station && item.police_station.toLowerCase().includes(lowercasedSearch)) ||
        item.id.toString().includes(lowercasedSearch)
      );
    }

    if (sortConfig !== null) {
      filteredData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filteredData;
  }, [criminals, searchTerm, sortConfig]);

  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const paginatedData = processedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortConfig]);

  // Format activity time
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString();
  };

  // Activity action colors
  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE': return 'var(--neon-cyan)';
      case 'UPDATE': return 'var(--neon-yellow)';
      case 'DELETE': return 'var(--neon-red)';
      case 'LOGIN': return '#00ff88';
      default: return 'var(--text-muted)';
    }
  };

  const columns: Column[] = [
    { header: 'ID', accessor: 'id', sortable: true },
    { header: 'Case ID', accessor: 'case_id', sortable: true },
    { header: 'Criminal Name', accessor: 'criminal_name', sortable: true },
    { header: 'Crime Type', accessor: 'crime_type', sortable: true },
    { header: 'Police Station', accessor: 'police_station', sortable: true },
    {
      header: 'Status', accessor: 'status', sortable: true, render: (val) => {
        let className = 'badge badge-medium';
        if (val === 'Active' || val === 'Wanted') className = 'badge badge-critical';
        else if (val === 'Captured') className = 'badge badge-active';
        return <span className={className}>{val || '—'}</span>;
      }
    },
    {
      header: 'Actions', accessor: '', render: (_, row) => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleEdit(row)} className="action-btn edit" title="Edit">
            <Edit size={16} />
          </button>
          <button onClick={() => handleDelete(row.id)} className="action-btn delete" title="Delete">
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <>
      {/* User bar */}
      <div className="topbar">
        <h2>System Overview</h2>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <button onClick={exportToCSV} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'var(--bg-panel)', padding: '8px 16px', border: '1px solid var(--border-color)', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            <Download size={16} /> Export CSV
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditingData(null); }}
            className="btn-primary"
          >
            <Plus size={16} /> Add Criminal
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 14px', background: 'var(--bg-panel)', borderRadius: '4px', border: '1px solid var(--border-color)' }}>
            <UserCircle size={18} style={{ color: 'var(--neon-cyan)' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-main)' }}>
              {user?.full_name}
            </span>
            <span className="badge badge-active" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
              {user?.role === 'admin' ? 'ADMIN' : 'OFFICER'}
            </span>
          </div>
          <button
            onClick={logout}
            style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'transparent', border: '1px solid var(--neon-red)', color: 'var(--neon-red)', padding: '8px 14px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', textTransform: 'uppercase', transition: 'all 0.2s' }}
            title="Logout"
          >
            <LogOut size={14} /> Logout
          </button>
          <div className="status-indicator">
            <div className="status-dot"></div>
            API Active
          </div>
        </div>
      </div>

      {/* Dashboard Stats - from MySQL */}
      <div className="dashboard-grid">
        <Card title="Total Criminals" value={stats.total} icon={<Users size={24} />} />
        <Card title="Active Cases" value={stats.active_cases} icon={<ShieldAlert size={24} />} alert={stats.active_cases > 0} />
        <Card title="Wanted Criminals" value={stats.wanted} icon={<AlertTriangle size={24} />} alert={stats.wanted > 0} />
        <Card title="Solved Cases" value={stats.captured} icon={<Server size={24} />} />
      </div>

      {/* Analytics Charts - from MySQL */}
      <AnalyticsCharts data={criminals} />

      {/* Live Activity Feed - from MySQL activity_log */}
      {activities.length > 0 && (
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{
            color: 'var(--neon-cyan)', fontFamily: 'var(--font-display)', fontSize: '0.85rem',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '15px',
            display: 'flex', alignItems: 'center', gap: '8px'
          }}>
            <Activity size={16} /> Live Activity Feed
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {activities.map((activity: any) => (
              <div key={activity.id} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 14px', background: 'rgba(12, 16, 26, 0.5)',
                borderRadius: '4px', borderLeft: `3px solid ${getActionColor(activity.action)}`,
                transition: 'background 0.2s',
              }}>
                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 'bold',
                  color: getActionColor(activity.action), textTransform: 'uppercase',
                  minWidth: '60px',
                }}>
                  {activity.action}
                </span>
                <span style={{ flex: 1, fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  {activity.description}
                </span>
                <span style={{
                  fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)',
                  display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap',
                }}>
                  <Clock size={12} /> {formatTime(activity.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Criminal Records Table */}
      <div className="table-section">
        <div className="table-header">
          <h3 className="section-title">Criminal Records</h3>
          <div className="search-container">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by ID, Name, Crime, Station..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>

        {showForm && (
          <CriminalForm
            initialData={editingData}
            onSubmit={handleFormSubmit}
            onCancel={() => { setShowForm(false); setEditingData(null); }}
          />
        )}

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            Loading records from database...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--neon-red)', fontFamily: 'var(--font-mono)' }}>
            {error}
          </div>
        ) : (
          <>
            <Table columns={columns} data={paginatedData} sortConfig={sortConfig} onSort={handleSort} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination">
                <span className="pagination-info">Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, processedData.length)} of {processedData.length} entries</span>
                <div className="pagination-buttons">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    <ChevronLeft size={16} /> Prev
                  </button>
                  <div className="page-numbers">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`page-number ${currentPage === i + 1 ? 'active' : ''}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
