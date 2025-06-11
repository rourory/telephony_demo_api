/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextURL } from "next/dist/server/web/next-url";

// prismaQueryParser.ts
// Утилита для парсинга DevExtreme-параметров в аргументы Prisma с TypeScript-типизацией.

/** Операторы фильтрации */
export type FilterOperator =
  | "="
  | "=="
  | "equals"
  | "<>"
  | "!="
  | "notequals"
  | "contains"
  | "notcontains"
  | "startswith"
  | "endswith"
  | ">"
  | ">="
  | "<"
  | "<="
  | "in"
  | "notin";

/** Кортеж одного условия фильтрации */
export type FilterClause = [string, FilterOperator, any];

/** Логический оператор между условиями */
export type LogicalOperator = "and" | "or";

/** Составной фильтр: массив из условий и логических операторов */
export type CompositeFilter = Array<FilterClause | LogicalOperator>;

/** Тип параметра filter из query */
export type RawFilter = FilterClause | CompositeFilter;

/** Элемент сортировки */
export interface SortDescriptor {
  selector: string;
  desc: boolean;
}

/** Параметры для парсинга */
export interface QueryParams {
  filter?: string; // JSON-stringified RawFilter
  sort?: string; // JSON-stringified SortDescriptor[]
  skip?: string; // числа как строки
  take?: string;
  requireTotalCount?: string; // 'true' | 'false'
}

/** Результирующие аргументы для Prisma */
export interface PrismaOptions {
  where?: Record<string, any>;
  orderBy?: Array<Record<string, "asc" | "desc">>;
  skip?: number;
  take?: number;
}

/** Результат парсинга, включая флаг totalCount */
export interface ParsedOptions {
  prismaOptions: PrismaOptions;
  requireTotalCount: boolean;
}

/** Map a single filter clause to a Prisma where condition. */
function mapClause(clause: FilterClause): Record<string, any> {
  const [field, operator, value] = clause;
  switch (operator) {
    case "=":
    case "==":
    case "equals":
      return { [field]: value };
    case "<>":
    case "!=":
    case "notequals":
      return { [field]: { not: value } };
    case "contains":
      return { [field]: { contains: value, mode: "insensitive" } };
    case "notcontains":
      return { [field]: { not: { contains: value, mode: "insensitive" } } };
    case "startswith":
      return { [field]: { startsWith: value, mode: "insensitive" } };
    case "endswith":
      return { [field]: { endsWith: value, mode: "insensitive" } };
    case ">":
      return { [field]: { gt: value } };
    case ">=":
      return { [field]: { gte: value } };
    case "<":
      return { [field]: { lt: value } };
    case "<=":
      return { [field]: { lte: value } };
    case "in":
      return { [field]: { in: Array.isArray(value) ? value : [value] } };
    case "notin":
      return { [field]: { notIn: Array.isArray(value) ? value : [value] } };
    default:
      throw new Error(`Unsupported operator: ${operator}`);
  }
}

/** Recursively parse filter array into Prisma where object. */
function parseFilter(filter: RawFilter): Record<string, any> {
  if (
    Array.isArray(filter) &&
    typeof filter[0] === "string" &&
    typeof filter[1] === "string"
  ) {
    if (!Array.isArray(filter[0])) {
      return mapClause(filter as FilterClause);
    }
  }
  if (Array.isArray(filter)) {
    const conditions: Record<string, any>[] = [];
    for (let i = 0; i < filter.length; i += 2) {
      conditions.push(parseFilter(filter[i] as RawFilter));
    }
    const op = filter[1] as LogicalOperator;
    if (op === "and") return { AND: conditions };
    if (op === "or") return { OR: conditions };
    throw new Error(`Unsupported logical operator: ${op}`);
  }
  return {};
}

/** Parse sort parameter into Prisma orderBy array. */
function parseSort(
  sortArr: SortDescriptor[]
): Array<Record<string, "asc" | "desc">> {
  return sortArr.map(({ selector, desc }) => ({
    [selector]: desc ? "desc" : "asc",
  }));
}

/**
 * Основная функция: конвертация query-параметров в аргументы Prisma, включая флаг requireTotalCount.
 * @returns ParsedOptions
 */
export function parseDevextremeOptions(url: NextURL): ParsedOptions {
  const query: QueryParams = {
    filter: url.searchParams.get("filter") ?? undefined,
    sort: url.searchParams.get("sort") ?? undefined,
    skip: url.searchParams.get("skip") ?? undefined,
    take: url.searchParams.get("take") ?? undefined,
    requireTotalCount: url.searchParams.get("requireTotalCount") ?? undefined,
  };

  const prismaOptions: PrismaOptions = {};

  // Парсим filter
  if (query.filter) {
    let raw: RawFilter;
    try {
      raw = JSON.parse(query.filter);
    } catch {
      throw new Error("Invalid JSON in filter parameter");
    }
    prismaOptions.where = parseFilter(raw);
  }

  // Парсим sort
  if (query.sort) {
    let rawSort: SortDescriptor[];
    try {
      rawSort = JSON.parse(query.sort);
    } catch {
      throw new Error("Invalid JSON in sort parameter");
    }
    prismaOptions.orderBy = parseSort(rawSort);
  }

  // Пагинация
  if (query.skip !== undefined) {
    prismaOptions.skip = Number(query.skip);
  }
  if (query.take !== undefined) {
    prismaOptions.take = Number(query.take);
  }

  // Флаг обязательного подсчета
  const requireTotalCount = query.requireTotalCount === "true";

  return { prismaOptions, requireTotalCount };
}
