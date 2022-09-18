import { useMemo } from "react";
import { Column } from "react-table";
import { faker } from "@faker-js/faker";

function getAccessors(columns: Array<Column>, result = new Set<string>()) {
  for (const column of columns) {
    if (column.accessor) result.add(column.accessor as string);
    getAccessors((column as any).columns ?? [], result);
  }
  return [...result];
}

const accessorFakers = {
  name: () => faker.name.fullName(),
  country: () => faker.name.jobArea(),
  structure: () => faker.word.noun(),
  gender: () => faker.helpers.arrayElement(["M", "F", "O", "U"]),
  age: () => faker.random.numeric(2),
  date: () => faker.date.recent().toLocaleDateString(),
  practicionerAffiliation: () => faker.company.bsNoun(),
  placeOfConsultation: () => faker.name.jobArea(),
} as const;

export function useGridData(count = 100) {
  const columns = useMemo<Array<Column>>(
    () => [
      {
        Header: "Healthcare user",
        columns: [
          {
            id: "col-placeholder-1",
            Header: "",
            columns: [
              {
                Header: "Patient name",
                accessor: "name",
              },
              {
                Header: "Country",
                accessor: "country",
              },
              {
                Header: "Structure",
                accessor: "structure",
              },
              {
                Header: "Gender",
                accessor: "gender",
              },
              {
                Header: "Age category",
                accessor: "age",
              },
            ],
          },
        ],
      },
      {
        Header: "Latest admission form",
        columns: [
          {
            id: "col-placeholder-2",
            Header: "",
            columns: [
              {
                Header: "Date",
                accessor: "date",
              },
            ],
          },
          {
            Header: "Consultation details",
            columns: [
              {
                Header: "Practicioner affiliation",
                accessor: "practicionerAffiliation",
              },
              {
                Header: "Place of consultation",
                accessor: "placeOfConsultation",
              },
            ],
          },
        ],
      },
    ],
    []
  );

  const data = useMemo(() => {
    const accessors = getAccessors(columns);
    const rows: Array<any> = [];

    for (let i = 0; i < count; i++) {
      const row = {};

      for (const accessor of accessors) {
        row[accessor] = accessorFakers[accessor]?.() ?? faker.random.word();
      }

      rows.push(row);
    }

    return rows;
  }, [columns]);

  return { columns, data };
}
