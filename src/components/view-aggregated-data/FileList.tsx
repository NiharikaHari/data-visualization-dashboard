/**
 * Component to display a list of files.
 * It renders each file as a list item and triggers a callback when a file is clicked.
 * Files named '.gitkeep' are excluded from the list.
 *
 * @param {Array<string>} files - The list of files to be displayed.
 * @param {function} onFileClick - The callback function to be triggered when a file is clicked.
 * @returns {JSX.Element} The rendered list of files with click functionality.
 */
interface Props {
  files: string[];
  onFileClick: (fileName: string) => void;
}

const FileList = ({ files, onFileClick }: Props) => (
  <ul>
    {/* Iterate over the files array and display each file, excluding '.gitkeep' */}
    {files.map((file) =>
      file !== '.gitkeep' ? (
        <li
          key={file}
          className="ml-2 cursor-pointer hover:text-blue-500 border-b border-gray-200 p-2"
          onClick={() => onFileClick(file)}
        >
          {file}
        </li>
      ) : null
    )}
  </ul>
);

export default FileList;
