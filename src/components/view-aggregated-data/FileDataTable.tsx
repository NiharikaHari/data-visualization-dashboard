/**
 * Component to display the top 5 rows of a given dataset in a table format.
 * It renders a table with the column headers based on the keys of the data objects,
 * and displays the first five rows of the provided data.
 *
 * @param {string} fileName - The name of the file for which data is displayed.
 * @param {Array<Object>} data - The dataset to be displayed in a table format.
 * @returns {JSX.Element} The rendered table with the first five rows of data.
 */

interface Props {
  fileName: string;
  data: { [key: string]: string | number | null }[];
}

const FileDataTable = ({ fileName, data }: Props) => {
  if (!data.length) return <p>No data available for {fileName}</p>;

  const headers = Object.keys(data[0]);
  const firstFiveRows = data.slice(0, 5);

  return (
    <div className="container mx-auto p-4 text-sm">
      {/* Displaying the title with the file name */}
      <h3 className="font-semibold mb-4">Top 5 rows of {fileName}</h3>

      {/* Table displaying the top 5 rows of data */}
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            {headers.map((header) => (
              <th key={header} className="border p-1">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {firstFiveRows.map((row, index) => (
            <tr key={index}>
              {headers.map((header) => (
                <td key={header} className="border p-1">
                  {row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileDataTable;
