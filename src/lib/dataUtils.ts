import { DataRow, PlotDataType } from '@/lib/types';

/**
 * Function to get the numeric columns from a dataset.
 *
 * @param data - The dataset to extract numeric columns from.
 * @returns An array of column names that contain only numeric values.
 */
export const getNumericColumns = (data: DataRow[]): string[] => {
  if (data && data.length > 0) {
    const headers = Object.keys(data[0]);
    return headers.filter((header) =>
      data.every((row) => {
        const value = row[header];
        return value !== null && value !== undefined && !isNaN(Number(value));
      })
    );
  }
  return [];
};

/**
 * Function to get the unique values of a specified field from the dataset.
 *
 * @param data - The dataset to extract the unique field values from.
 * @param fieldName - The name of the field to extract unique values for.
 * @returns An array of unique values for the specified field.
 */
export const getUniqueFieldValues = (data: DataRow[], fieldName: string) => {
  return [
    ...new Set(
      data.map((item) => item[fieldName]).filter((value) => value !== undefined)
    ),
  ];
};

/**
 * Function to filter the dataset based on a specified condition.
 *
 * @param plotData - The plot configuration containing the filter condition.
 * @param fileData - The dataset to filter.
 * @param setFilteredData - The function to set the filtered data.
 */
export const filterData = (
  plotData: PlotDataType,
  fileData: DataRow[],
  setFilteredData: React.Dispatch<React.SetStateAction<DataRow[]>>
) => {
  if (plotData.filterBy && plotData.filterValue) {
    const filtered = fileData.filter(
      (item) => item[plotData.filterBy] === plotData.filterValue
    );
    setFilteredData(filtered);
  } else {
    setFilteredData(fileData);
  }
};

/**
 * Function to group the data by the x-axis for a bar chart.
 *
 * @param filteredData - The filtered dataset to group.
 * @param plotData - The plot configuration containing the x-axis and y-axis field names.
 * @returns An object where each key is an x-axis value, and the value is an object containing the total and count of y-axis values.
 */
export const groupDataBar = (
  filteredData: DataRow[],
  plotData: PlotDataType
) => {
  const groupedData = filteredData.reduce((acc, item) => {
    const xValue = item[plotData.xAxis];
    const yValue = parseFloat(item[plotData.yAxis]) || 0;

    if (!acc[xValue]) {
      acc[xValue] = { total: 0, count: 0 };
    }

    acc[xValue].total += yValue;
    acc[xValue].count += 1;

    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  return groupedData;
};

/**
 * Function to group the data by both x-axis and a stack group for a stacked bar chart.
 *
 * @param filteredData - The filtered dataset to group.
 * @param plotData - The plot configuration containing the x-axis, y-axis, and stack group field names.
 * @returns An object where each key is a stack group, and the value is an object where each x-axis value has a total and count of y-axis values.
 */
export const groupDataBarGrouped = (
  filteredData: DataRow[],
  plotData: PlotDataType
) => {
  const groupedData = filteredData.reduce((acc, item) => {
    const group = item[plotData.stackGroupBy] as string;
    const xValue = item[plotData.xAxis] as string;
    const yValue = parseFloat(item[plotData.yAxis] as string) || 0;

    if (!acc[group]) {
      acc[group] = {};
    }
    if (!acc[group][xValue]) {
      acc[group][xValue] = { total: 0, count: 0 };
    }

    acc[group][xValue].total += yValue;
    acc[group][xValue].count += 1;

    return acc;
  }, {} as Record<string, Record<string, { total: number; count: number }>>);

  return groupedData;
};

/**
 * Function to aggregate data and calculate averages for each x-axis value.
 *
 * @param data - The grouped data containing the total and count for each x-axis value.
 * @param plotData - The plot configuration containing the x-axis and y-axis field names.
 * @returns An array of objects with x-axis, y-axis average, and label for each group.
 */
export const aggregateDataAverage = (
  data: Record<
    string,
    {
      total: number;
      count: number;
    }
  >,
  plotData: PlotDataType
) => {
  return Object.entries(data)
    .map(([x, { total, count }]) => ({
      x,
      y: total / count,
      label: `${plotData.xAxis}: ${x},\n Avg ${plotData.yAxis}: ${(
        total / count
      ).toFixed(2)}`,
    }))
    .sort((a, b) => {
      const isNumeric = !isNaN(Number(a.x)) && !isNaN(Number(b.x));
      return isNumeric ? Number(a.x) - Number(b.x) : a.x.localeCompare(b.x);
    });
};

/**
 * Function to aggregate data for each group and calculate averages.
 *
 * @param data - The grouped data containing the total and count for each group and x-axis value.
 * @param plotData - The plot configuration containing the x-axis and y-axis field names.
 * @returns An array of objects, where each object represents a group and contains the aggregated data for each x-axis value.
 */
export const aggregateDataAverageGroup = (
  data: Record<
    string,
    Record<
      string,
      {
        total: number;
        count: number;
      }
    >
  >,
  plotData: PlotDataType
) => {
  return Object.entries(data).map(([group, values]) => ({
    group,
    data: Object.entries(values).map(([x, { total, count }]) => ({
      x,
      y: total / count,
      label: `Group: ${group}\n${plotData.xAxis}: ${x}\nAvg ${
        plotData.yAxis
      }: ${(total / count).toFixed(2)}`,
    })),
  }));
};

/**
 * Utility function to split long labels into multiple lines for better readability.
 *
 * @param label - The label to be split.
 * @param maxLength - The maximum length of a label line.
 * @returns A string with the label split into multiple lines.
 */
export const splitLabel = (label: string, maxLength: number): string => {
  if (!label) return label;

  const words = label.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    if ((currentLine + word).length <= maxLength) {
      currentLine += word + ' ';
    } else {
      lines.push(currentLine.trim());
      currentLine = word + ' ';
    }
  });

  if (currentLine) lines.push(currentLine.trim());

  return lines.join('\n');
};
