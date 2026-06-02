import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import api from '../api/axios';

// Neon color palette for charts
const CHART_COLORS = ['#00f0ff', '#ff003c', '#fcee0a', '#00ff88', '#ff6600', '#aa00ff', '#00aaff', '#ff0088', '#66ff33', '#ff3366'];

interface AnalyticsChartsProps {
  data: any[]; // criminals array passed from parent for basic calculation
}

interface StatsData {
  total: number;
  active_cases: number;
  wanted: number;
  captured: number;
  deceased: number;
  crimeTypes: { crime_type: string; count: number }[];
  statusDist: { status: string; count: number }[];
  monthlyTrends: { month: string; count: number }[];
  stationDist: { police_station: string; count: number }[];
  genderDist: { gender: string; count: number }[];
  ageDist: { age_group: string; count: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'rgba(12, 16, 26, 0.95)',
        border: '1px solid var(--neon-cyan)',
        borderRadius: '4px',
        padding: '10px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        color: '#e2e8f0',
        boxShadow: '0 0 15px rgba(0, 240, 255, 0.2)'
      }}>
        <p style={{ color: 'var(--neon-cyan)', marginBottom: '4px' }}>{label || payload[0].name}</p>
        <p>{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ data: _data }) => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [_data]); // Refetch when parent data changes (after CRUD operations)

  const fetchStats = async () => {
    try {
      const response = await api.get('/criminals/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Loading analytics...
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Unable to load analytics data
      </div>
    );
  }

  const chartContainerStyle: React.CSSProperties = {
    padding: '20px',
    minHeight: '300px',
  };

  const chartTitleStyle: React.CSSProperties = {
    color: 'var(--neon-cyan)',
    fontFamily: 'var(--font-display)',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '15px',
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
      {/* Crime Type Distribution - Bar Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Crime Type Distribution</h4>
        {stats.crimeTypes.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.crimeTypes}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="crime_type" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Share Tech Mono' }} angle={-30} textAnchor="end" height={60} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#00f0ff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Status Distribution - Pie Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Status Distribution</h4>
        {stats.statusDist.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.statusDist}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(props: any) => `${props.status}: ${props.count}`}
                labelLine={{ stroke: '#94a3b8' }}
              >
                {stats.statusDist.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Monthly Trends - Line Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Monthly Trends (Last 12 Months)</h4>
        {stats.monthlyTrends.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Share Tech Mono' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="count" stroke="#00f0ff" strokeWidth={2} dot={{ fill: '#00f0ff', r: 4 }} activeDot={{ r: 6, stroke: '#00f0ff', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Police Station Hotspots - Bar Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Crime Hotspots (By Police Station)</h4>
        {stats.stationDist.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.stationDist} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <YAxis dataKey="police_station" type="category" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Share Tech Mono' }} width={120} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#ff003c" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Gender Distribution - Pie Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Gender Distribution</h4>
        {stats.genderDist.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.genderDist}
                dataKey="count"
                nameKey="gender"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={(props: any) => `${props.gender}: ${props.count}`}
                labelLine={{ stroke: '#94a3b8' }}
              >
                {stats.genderDist.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontFamily: 'Share Tech Mono', fontSize: '0.8rem', color: '#94a3b8' }} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Age Distribution - Bar Chart */}
      <div className="glass-panel" style={chartContainerStyle}>
        <h4 style={chartTitleStyle}>Age Distribution</h4>
        {stats.ageDist.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '60px 0', fontFamily: 'var(--font-mono)' }}>
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={stats.ageDist}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.1)" />
              <XAxis dataKey="age_group" tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'Share Tech Mono' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#fcee0a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
