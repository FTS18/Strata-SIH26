import React from 'react';
import { cn } from '@/lib/utils';

export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  width?: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No records found',
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-lg border border-[var(--surface-border)] bg-[var(--surface-panel)] shadow-sm',
        className
      )}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[var(--surface-border)] bg-[var(--surface-canvas)] text-[var(--text-secondary)]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className={cn(
                    'px-4 py-3 font-medium text-xs select-none',
                    col.align === 'right' && 'text-right',
                    col.align === 'center' && 'text-center'
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#111c33]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-xs text-[var(--text-secondary)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const key = keyExtractor(item);
                return (
                  <tr
                    key={key}
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      'transition-colors hover:bg-[var(--surface-subtle)]/40',
                      onRowClick && 'cursor-pointer'
                    )}
                  >
                    {columns.map((col) => {
                      const value = (item as any)[col.key];
                      return (
                        <td
                          key={col.key}
                          className={cn(
                            'px-4 py-3 text-[var(--text-primary)] align-middle text-xs',
                            col.align === 'right' && 'text-right font-mono tabular-nums',
                            col.align === 'center' && 'text-center'
                          )}
                        >
                          {col.render ? col.render(item) : value}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
