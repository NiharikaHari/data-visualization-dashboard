export type FormData = {
  demographic_file?: string;
  expenditure_file?: string;
  action?: string;
  aggregation_parameters?: string;
};

export interface DataRow {
  [key: string]: string;
}

export interface PlotDataType {
  chartType: string;
  aggData: string;
  xAxis: string;
  yAxis: string;
  filterBy: string;
  filterValue: string;
  stackGroupBy: string;
}

export interface OptionsType {
  chartType: string[];
  aggData: string[];
  xAxis: string[];
  yAxis: string[];
  filterBy: string[];
  filterValue: string[];
  stackGroupBy: string[];
}

export const colorScale = [
  '#3949AB',
  '#00ACC1',
  '#FDD835',
  '#FB8C00',
  '#F4511E',
  '#1E88E5',
  '#8E24AA',
  '#D81B60',
  '#7CB342',
];
