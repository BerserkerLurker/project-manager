import BTable from "react-bootstrap/Table";
import { useTable } from "react-table";

export default function Table({
  columns,
  data,
  updateMyData,
  displayTaskModal,
}) {
  // const [records, setRecords] = useState(data);

  // const getRowId = useCallback(row => {return row.id},[])

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    // @ts-ignore
    useTable({ data, columns, updateMyData, displayTaskModal });

  return (
    <BTable
      responsive
      className={data.length ? "table-hover" : "d-none"}
      {...getTableProps()}
    >
      <thead className="table-light">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody className="table-group-divider" {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr
              style={{ cursor: "pointer" }}
              {...row.getRowProps()}
              onClick={() => {
                displayTaskModal(true, row.original);
              }}
            >
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </BTable>
  );
}
