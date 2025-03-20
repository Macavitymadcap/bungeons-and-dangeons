interface DataTableProps<T extends object> {
  headings: string[];
  rows: T[];
}

export const DataTable = <T extends object>({
  headings,
  rows,
}: DataTableProps<T>) => {
  return (
    <table>
      <thead>
        <tr>
          {headings.map(heading => (
            <th>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr>
            {Object.values(row).map((value, index) => (
              <td key={index}>{value ? String(value) : ''}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
