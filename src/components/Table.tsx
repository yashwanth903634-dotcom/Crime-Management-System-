import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export interface Column {
  header: string;
  accessor: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface TableProps {
  columns: Column[];
  data: any[];
  sortConfig?: { key: string; direction: 'asc' | 'desc' } | null;
  onSort?: (key: string) => void;
}

export const Table: React.FC<TableProps> = ({ columns, data, sortConfig, onSort }) => {
  return (
    <div className="table-container">
      <table className="cyber-table">
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th 
                key={index}
                className={col.sortable ? 'sortable-header' : ''}
                onClick={() => col.sortable && onSort && onSort(col.accessor)}
                style={{ cursor: col.sortable ? 'pointer' : 'default' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  {col.header}
                  {col.sortable && sortConfig?.key === col.accessor && (
                    sortConfig.direction === 'asc' 
                      ? <ChevronUp size={14} /> 
                      : <ChevronDown size={14} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={row.id || rowIndex}>
                {columns.map((col, colIndex) => (
                  <td key={colIndex}>
                    {col.render 
                      ? col.render(row[col.accessor], row) 
                      : row[col.accessor] ?? '—'
                    }
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
