/**
 * Type representing the form data used for submitting a request.
 *
 * @property demographic_file - The name of the demographic data file (optional).
 * @property expenditure_file - The name of the expenditure data file (optional).
 * @property action - The action to be performed (optional).
 * @property aggregation_parameters - The parameters for data aggregation (optional).
 */
export type FormData = {
  demographic_file?: string;
  expenditure_file?: string;
  action?: string;
  aggregation_parameters?: string;
};

/**
 * Interface representing a row of data.
 */
export interface DataRow {
  [key: string]: string;
}

/**
 * Interface representing the configuration for a plot.
 *
 * @property chartType - The type of chart to be generated (e.g., bar, line).
 * @property aggData - The data to be aggregated.
 * @property xAxis - The field to be used for the x-axis.
 * @property yAxis - The field to be used for the y-axis.
 * @property filterBy - The field by which to filter the data.
 * @property filterValue - The value for filtering the data.
 * @property stackGroupBy - The field to group data for stacking (e.g., in a stacked bar chart).
 */
export interface PlotDataType {
  chartType: string;
  aggData: string;
  xAxis: string;
  yAxis: string;
  filterBy: string;
  filterValue: string;
  stackGroupBy: string;
}

/**
 * Interface representing the available options for configuring a plot.
 *
 * @property chartType - Possible chart types.
 * @property aggData - Available data for aggregation.
 * @property xAxis - Available fields for the x-axis.
 * @property yAxis - Available fields for the y-axis.
 * @property filterBy - Available fields for filtering the data.
 * @property filterValue - Available values for filtering.
 * @property stackGroupBy - Available fields for grouping data in stacked charts.
 */
export interface OptionsType {
  chartType: string[];
  aggData: string[];
  xAxis: string[];
  yAxis: string[];
  filterBy: string[];
  filterValue: string[];
  stackGroupBy: string[];
}

/**
 * An array representing a set of colors for use in charts.
 */
export const colorScale = [
  '#3949AB', // Blue
  '#00ACC1', // Cyan
  '#FDD835', // Yellow
  '#FB8C00', // Orange
  '#F4511E', // Red
  '#1E88E5', // Blue
  '#8E24AA', // Purple
  '#D81B60', // Pink
  '#7CB342', // Green
];
