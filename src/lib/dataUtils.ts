import { DataRow, PlotDataType } from './types';

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

export const getUniqueFieldValues = (data: DataRow[], fieldName: string) => {
  return [
    ...new Set(
      data.map((item) => item[fieldName]).filter((value) => value !== undefined)
    ),
  ];
};

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

// Process data to group by x-axis
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

// Map grouped data to the required format and calculate averages
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

// Utility function to split long labels into multiple lines for better readability
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
