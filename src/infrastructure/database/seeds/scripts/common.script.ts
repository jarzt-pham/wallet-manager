export const createAlterIncrementQuery = (
  table: {
    name: string;
    column: string;
  },
  start: number = 1,
) =>
  `SELECT pg_get_serial_sequence('${table.name}', '${table.column}');SELECT setval('${table.name}_${table.column}_seq', ${start}, false);`;
