import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("pt-BR");
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Filtra um array de itens baseado em um termo de busca em múltiplos campos
 * @param items Array de itens a serem filtrados
 * @param searchTerm Termo de busca (case-insensitive)
 * @param searchFields Campos do objeto onde a busca será realizada
 * @returns Array filtrado
 */
export function filterBySearch<T extends Record<string, any>>(
  items: T[],
  searchTerm: string,
  searchFields: (keyof T)[]
): T[] {
  if (!searchTerm.trim()) {
    return items;
  }

  const lowerSearchTerm = searchTerm.toLowerCase().trim();

  return items.filter((item) => {
    return searchFields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) {
        return false;
      }
      return String(value).toLowerCase().includes(lowerSearchTerm);
    });
  });
}

