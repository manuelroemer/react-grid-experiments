import {
  Button,
  Layer,
  Search,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableExpandedRow,
  TableBody,
  TableCell,
  TableSelectAll,
  TableSelectRow,
  CodeSnippet,
  Stack,
} from "@carbon/react";
import {
  ChevronDown,
  ChevronUp,
  ChevronSort,
  ArrowUp,
  ArrowDown,
  Download,
  OpenPanelRight,
} from "@carbon/react/icons";
import { Fragment, ReactNode, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import styles from "./App.module.scss";
import { useGridData } from "./gridData";


export default function App() {
  const [sidePanel, setSidePanel] = useState<ReactNode | undefined>();
  const { columns, data } = useGridData();
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  });

  const headerGroups = table.getHeaderGroups();

  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeaderContainer}>
          <Button size="sm" kind="ghost" renderIcon={Download}>
            Download
          </Button>
          <Button size="sm" kind="ghost" renderIcon={OpenPanelRight}>
            Columns (?/{headerGroups[headerGroups.length - 1].headers.length})
          </Button>
          <Layer className={styles.tableSearchLayer}>
            <Search
              size="sm"
              placeholder="Search"
              labelText="Search"
              onChange={(e) => setGlobalFilter(e.target.value)}
            />
          </Layer>
        </div>

        <div>
          <Table useZebraStyles>
            <TableHead>
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <TableRow
                  key={headerGroup.id}
                  className={styles.tableHeaderRow}
                >
                  {/* The select all checkbox must only ever appear in the bottom row. Other rows just use an empty cell. */}
                  {headerGroupIndex === headerGroups.length - 1 ? (
                    <TableSelectAll
                      checked={table.getIsAllRowsSelected()}
                      indeterminate={
                        !table.getIsAllRowsSelected() &&
                        table.getIsSomeRowsSelected()
                      }
                      id="table-select-all"
                      name="table-select-all"
                      onSelect={() => table.toggleAllRowsSelected()}
                    />
                  ) : (
                    <TableHeader />
                  )}

                  {/* Expand header. */}
                  <TableHeader />

                  {headerGroup.headers.map((header) => (
                    <TableHeader key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : (
                        <div className={styles.headerWithActions}>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}

                          {headerGroupIndex === headerGroups.length - 1 && (
                            <Button
                              hasIconOnly
                              renderIcon={
                                header.column.getIsSorted() !== false
                                  ? header.column.getIsSorted() === "desc"
                                    ? ArrowDown
                                    : ArrowUp
                                  : ChevronSort
                              }
                              size="sm"
                              kind="ghost"
                              iconDescription="Sort"
                              onClick={header.column.getToggleSortingHandler()}
                            />
                          )}
                        </div>
                      )}
                    </TableHeader>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <TableRow>
                    <TableSelectRow
                      aria-label="Select"
                      checked={row.getIsSelected()}
                      id={`row-select-${row.id}`}
                      name={`row-select-${row.id}`}
                      onSelect={() => row.toggleSelected()}
                    />

                    <TableCell>
                      <div className={styles.expandCell}>
                        Show all forms{" "}
                        <Button
                          hasIconOnly
                          renderIcon={
                            row.getIsExpanded() ? ChevronUp : ChevronDown
                          }
                          size="sm"
                          kind="ghost"
                          iconDescription="Show all forms"
                          onClick={() => row.toggleExpanded()}
                        />
                      </div>
                    </TableCell>

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        onClick={() => {
                          setSidePanel(
                            <EditPanel
                              info={`Cell value: ${cell.getValue()}\nRow: ${JSON.stringify(
                                row.original,
                                null,
                                2
                              )}`}
                              close={() => setSidePanel(undefined)}
                            />
                          );
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.getIsExpanded() && (
                    <TableExpandedRow colSpan="100%">
                      <h1>Inner Form Grid Goes here</h1>
                    </TableExpandedRow>
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {sidePanel && <aside className={styles.sidePanel}>{sidePanel}</aside>}
    </div>
  );
}

function EditPanel({ close, info }) {
  return (
    <Stack>
      <h1>Edit</h1>
      <CodeSnippet type="multi">{info}</CodeSnippet>
      <Button onClick={close}>Close</Button>
    </Stack>
  );
}
