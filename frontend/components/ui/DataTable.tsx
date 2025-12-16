"use client";

import { ReactNode } from "react";
import { Loading } from "./Loading";
import { ErrorMessage } from "./ErrorMessage";
import { Button } from "./Button";
import { cn } from "@/lib/utils";

export interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

export interface TableAction<T> {
  label: string;
  icon: ReactNode;
  onClick: (item: T) => void;
  variant?: "primary" | "secondary" | "danger" | "outline";
  condition?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  onRetry?: () => void;
  actions?: TableAction<T>[];
  getRowId?: (item: T) => string | number;
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  error,
  emptyMessage = "Nenhum registro encontrado.",
  onRetry,
  actions,
  getRowId,
  className,
}: DataTableProps<T>) {
  const getItemId = (item: T, index: number): string | number => {
    if (getRowId) {
      return getRowId(item);
    }
    return (item as any).id ?? index;
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  const hasActions = actions && actions.length > 0;

  return (
    <div className={cn("bg-white rounded-lg shadow overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                    column.className
                  )}
                >
                  {column.label}
                </th>
              ))}
              {hasActions && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => {
              const itemId = getItemId(item, index);
              return (
                <tr
                  key={itemId}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => {
                    const cellContent = column.render
                      ? column.render(item)
                      : (item[column.key] as ReactNode) ?? "-";

                    return (
                      <td
                        key={column.key}
                        className={cn(
                          "px-6 py-4 whitespace-nowrap text-sm text-gray-500",
                          column.className
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {hasActions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {actions!.map((action, actionIndex) => {
                          const shouldShow =
                            !action.condition || action.condition(item);
                          const isDisabled =
                            action.disabled && action.disabled(item);

                          if (!shouldShow) {
                            return null;
                          }

                          return (
                            <Button
                              key={actionIndex}
                              variant={action.variant || "secondary"}
                              className={cn("p-1.5", action.className)}
                              title={action.label}
                              onClick={() => action.onClick(item)}
                              disabled={isDisabled}
                            >
                              {action.icon}
                            </Button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

