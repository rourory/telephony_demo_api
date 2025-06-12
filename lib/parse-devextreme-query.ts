/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextURL } from "next/dist/server/web/next-url";

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

/** Элемент сортировки в JSON-массиве */
export interface SortDescriptor {
  selector: string;
  desc?: boolean;
}

/** Параметры для парсинга */
export interface QueryParams {
  filter?: string; // JSON-stringified RawFilter
  sort?: string; // JSON-stringified SortDescriptor[] или простое имя поля
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

/** Map одного FilterClause в Prisma-условие */
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

/** Рекурсивно парсим DevExtreme-фильтр в Prisma-where */
function parseFilter(filter: RawFilter): Record<string, any> {
  if (
    Array.isArray(filter) &&
    typeof filter[0] === "string" &&
    typeof filter[1] === "string"
  ) {
    // это одиночный FilterClause
    return mapClause(filter as FilterClause);
  }

  // составной фильтр [cond1, 'and', cond2, 'or', cond3, ...]
  const conditions: Record<string, any>[] = [];
  for (let i = 0; i < filter.length; i += 2) {
    conditions.push(parseFilter(filter[i] as RawFilter));
  }
  const op = filter[1] as LogicalOperator;
  if (op === "and") return { AND: conditions };
  if (op === "or") return { OR: conditions };
  throw new Error(`Unsupported logical operator: ${op}`);
}

/** Парсинг sort-параметра в orderBy для Prisma */
function parseSortParam(
  sortParam?: string
): Array<Record<string, "asc" | "desc">> | undefined {
  if (!sortParam) return undefined;

  let descriptors: SortDescriptor[] = [];

  // Попытка распарсить JSON
  try {
    const parsed = JSON.parse(sortParam);
    if (Array.isArray(parsed)) {
      // JSON-массив объектов { selector, desc? }
      descriptors = parsed.map((d: any) => ({
        selector: String(d.selector),
        desc: Boolean(d.desc),
      }));
    } else if (typeof parsed === "string") {
      // JSON-строка: "fieldName"
      descriptors = [{ selector: parsed, desc: false }];
    } else {
      throw new Error();
    }
  } catch {
    // не JSON — считаем, что это просто имя поля без кавычек
    descriptors = [{ selector: sortParam, desc: false }];
  }

  // Переводим в формат Prisma
  return descriptors.map(({ selector, desc }) => ({
    [selector]: desc ? "desc" : "asc",
  }));
}

/**
 * Основная функция: конвертация query-параметров из NextURL
 * в аргументы Prisma + флаг requireTotalCount.
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

  // 1) Фильтрация
  if (query.filter) {
    let raw: RawFilter;
    try {
      raw = JSON.parse(query.filter);
    } catch {
      throw new Error("Invalid JSON in filter parameter");
    }
    prismaOptions.where = parseFilter(raw);
  }

  // 2) Сортировка
  prismaOptions.orderBy = parseSortParam(query.sort);

  // 3) Пагинация
  if (query.skip !== undefined) prismaOptions.skip = Number(query.skip);
  if (query.take !== undefined) prismaOptions.take = Number(query.take);

  // 4) Флаг подсчёта общего числа
  const requireTotalCount = query.requireTotalCount === "true";

  return { prismaOptions, requireTotalCount };
}
