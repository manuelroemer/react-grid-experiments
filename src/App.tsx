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
  Filter,
  Download,
  OpenPanelRight,
} from "@carbon/react/icons";
import { ReactNode, useState } from "react";
import {
  useSortBy,
  useExpanded,
  useRowSelect,
  useTable,
  useGlobalFilter,
} from "react-table";
import styles from "./App.module.scss";
import { useGridData } from "./gridData";

export default function App() {
  const { columns, data } = useGridData();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    isAllRowsSelected,
    toggleRowSelected,
    toggleAllRowsSelected,
    toggleRowExpanded,
    setGlobalFilter,
    state: { selectedRowIds, expanded },
  } = useTable(
    { columns, data },
    useGlobalFilter,
    useSortBy,
    useExpanded,
    useRowSelect
  );
  const [sidePanel, setSidePanel] = useState<ReactNode | undefined>();

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
          <Table {...getTableProps()} useZebraStyles>
            <TableHead>
              {headerGroups.map((headerGroup, headerGroupIndex) => (
                <TableRow
                  className={styles.tableHeaderRow}
                  {...headerGroup.getHeaderGroupProps()}
                >
                  {/* The select all checkbox must only ever appear in the bottom row. Other rows just use an empty cell. */}
                  {headerGroupIndex === headerGroups.length - 1 ? (
                    <TableSelectAll
                      checked={isAllRowsSelected}
                      indeterminate={
                        !isAllRowsSelected && selectedFlatRows.length > 0
                      }
                      id="table-select-all"
                      name="table-select-all"
                      onSelect={() => toggleAllRowsSelected(!isAllRowsSelected)}
                    />
                  ) : (
                    <TableHeader />
                  )}

                  {/* Expand header. */}
                  <TableHeader />

                  {headerGroup.headers.map((column) =>
                    headerGroupIndex === headerGroups.length - 1 ? (
                      // Last row header. Only those can have actions.
                      <TableHeader {...column.getHeaderProps()}>
                        <div className={styles.headerWithActions}>
                          {column.render("Header")}

                          <Button
                            hasIconOnly
                            renderIcon={
                              column.isSorted
                                ? column.isSortedDesc
                                  ? ArrowDown
                                  : ArrowUp
                                : ChevronSort
                            }
                            size="sm"
                            kind="ghost"
                            iconDescription="Sort"
                            onClick={() => column.toggleSortBy()}
                          />

                          <Button
                            hasIconOnly
                            renderIcon={Filter}
                            size="sm"
                            kind="ghost"
                            iconDescription="Filter..."
                          />
                        </div>
                      </TableHeader>
                    ) : (
                      // Grouping header.
                      <TableHeader {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </TableHeader>
                    )
                  )}
                </TableRow>
              ))}
            </TableHead>

            <TableBody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);

                return (
                  <>
                    <TableRow {...row.getRowProps()}>
                      <TableSelectRow
                        aria-label="Select"
                        checked={selectedRowIds[row.id]}
                        id={`row-select-${row.id}`}
                        name={`row-select-${row.id}`}
                        onSelect={() => toggleRowSelected(row.id)}
                      />

                      <TableCell>
                        <div className={styles.expandCell}>
                          Show all forms{" "}
                          <Button
                            hasIconOnly
                            renderIcon={
                              expanded[row.id] ? ChevronUp : ChevronDown
                            }
                            size="sm"
                            kind="ghost"
                            iconDescription="Show all forms"
                            onClick={() => toggleRowExpanded([row.id])}
                          />
                        </div>
                      </TableCell>

                      {row.cells.map((cell) => (
                        <TableCell
                          {...cell.getCellProps()}
                          onClick={() => {
                            setSidePanel(
                              <EditPanel
                                info={`Cell value: ${
                                  cell.value
                                }\nRow: ${JSON.stringify(
                                  row.original,
                                  null,
                                  2
                                )}`}
                                close={() => setSidePanel(undefined)}
                              />
                            );
                          }}
                        >
                          {cell.render("Cell")}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expanded[row.id] && (
                      <TableExpandedRow colSpan={rows.length + 1}>
                        <h1>Inner Form Grid Goes here</h1>
                      </TableExpandedRow>
                    )}
                  </>
                );
              })}
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
