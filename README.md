# Interactive Dashboard to Visualize Pipeline Results

This application allows users to:

- Run a data pipeline with user-specified input parameters.
- Retrieve and list the aggregated data
- Select chart type, dataset, and customize axes, filters, and groupings for dynamic data visualization.

## Project Structure

Here's a brief overview of the key files and directories:

```
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   ├── run-pipeline/               # Feature: Running pipelines
│   │   │   ├── Modal.tsx               # Component for modal overlay
│   │   │   ├── RadioInput.tsx          # Component for radio input
│   │   │   ├── RunPipelineTab.tsx      # Component for 'Run Pipeline' tab
│   │   │   └── TextArea.tsx            # Component for text area input
│   │   ├── view-aggregated-data/       # Feature: View aggregated data
│   │   │   ├── AggregatedTab.tsx       # Component for 'View Aggregated Data' tab
│   │   │   ├── FileDataTable.tsx       # Component for data table
│   │   │   └── FileList.tsx            # Component for list of files
│   │   ├── visualize-data/             # Feature: Data visualization
│   │   │   ├── VisualizeTab.tsx        # Component for 'Visualize Data' tab
│   │   │   ├── Dropdown.tsx            # Component for dropdowns
│   │   │   ├── Chart.tsx               # Component for chart area
│   │   │   └── charts/                 # Components for rendering the respective charts
│   │   │       ├── BarChart.tsx
│   │   │       ├── GroupedBarChart.tsx
│   │   │       ├── Histogram.tsx
│   │   │       ├── LineChart.tsx
│   │   │       ├── PieChart.tsx
│   │   │       └── StackedBarChart.tsx
│   │   └── Tabs.tsx                    # Tabs to navigate between different sections of the dashboard
│   ├── lib/
│   │   ├── apiUtils.ts                 # Utilities for API integration
│   │   ├── dataUtils.ts                # Utilities for data processing
│   │   └── types.ts                    # Typescript types for data
│   ├── App.tsx                         # Entry point component
│   ├── index.css                       # Global styles
│   └── main.tsx                        # React entry point
├── vite.config.ts                      # Vite configuration settings

```

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.17.0 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Setting Up Locally

Follow these steps to set up and run the front-end locally:

#### 1. Clone the Repository

Clone the repository to your local machine using Git:

```bash
git clone <repository-url>
cd <repository-name>
```

#### 2. Install Dependencies

Install all the required dependencies using npm:

```bash
npm install
```

#### 3. Run the Development Server

Start the local development server to preview your dashboard:

```bash
npm run dev
```

This will start the application at `http://localhost:5173` (or another port specified in your configuration). Open this URL in your browser to view the dashboard.

> [!NOTE]
> If you wish to use a different port, please run the command:
> `npm run dev -- --port <PORT>`

#### 4. Run the Data Pipeline Service API

Start the data pipeline application as explained [here](https://github.com/NiharikaHari/data-pipeline/tree/main?tab=readme-ov-file#getting-started)

> [!NOTE]
> If you modify the base URL of the API service, please update the proxy settings in `vite.config.ts` to reflect the change.

#### 5. Access the Dashboard

Once the development server and API service are running, you can open the app in your browser by navigating to the local URL, which is typically `http://localhost:5173`.

## Using the Interactive Dashboard

### 1. Run Pipeline Tab

This tab has input fields and 'Run Pipeline' button to trigger the pipeline.

#### Input Parameters

- The input parameters and their default values are the same as [request parameters](https://github.com/NiharikaHari/data-pipeline/tree/main?tab=readme-ov-file#request-parameters) in the data pipeline API service.
- In order to generate custom data aggregations, you may enter JSON shaped data in `Aggregation Parameters` field. These must be formatted as explained [here](https://github.com/NiharikaHari/data-pipeline/tree/main?tab=readme-ov-file#aggregation-parameters).

#### Trigger Pipeline

- You may enter the input as required, or leave them empty and click on `Run Pipeline` to trigger the pipeline.
- Once the pipeline is finished running, a message will be displayed with success or failure message.

---

### 2. View Aggregated Data

This tab displays the list of aggregated data files and the top 5 rows of selected aggregated dataset.

#### Viewing Aggregated Data

- Click on any of the file names displayed under 'List of Aggregated Data Tables' to view the top 5 rows of data present in the data file.

#### Reload Data

- Incase the aggregated data is out of sync, use the `Reload Data` button to fetch the aggregated data again

---

### 3. Visualize Data

This tab visualizes aggregated data with user-specified fields.

#### Select Chart Type

- This dropdown is for the user to select the chart type.

- Below are the available chart types:
	- Bar Chart
	- Grouped Bar Chart
	- Stacked Bar Chart
	- Histogram
	- Pie Chart
	- Line Chart

- Click on the `Select Chart Type` dropdown to select any one.
- Based on the selected chart type, the rest of the input dropdowns will be rendered.

#### Select Aggregated Data

- This dropdown will list the available aggregated data files (as viewed in the previous tab). Select the desired dataset from `Select Aggregated Data` dropdown

#### Select Plot Data

- Based on the chart type, the user can select plot data from dropdowns - `Select X-Axis`, `Select Y-Axis`, `Stack/Group By` , `Select Category` and `Select Values`.
- The dropdown values are dynamically retrieved based on the chart type and available fields in the selected dataset.
- The dropdowns may show only numeric or non-numeric data based on the chart type.

#### Filter By

- The user may filter the rendered chart based on any field-value pair from the selected dataset.
- This can be done by selecting values from `Filter By` and `Select Filter Value` dropdowns.
- Filtering is only supported for categorical(non-numeric) data

## Built With

- [React](https://react.dev)- JavaSscript framework
- [Vite](https://vitejs.dev) - Build tool and development server
- [Node.js](https://nodejs.org) - JavaScript runtime for server-side development
- [npm](https://www.npmjs.com) - Package manager for managing project dependencies
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Victory](https://commerce.nearform.com/open-source/victory/) - JavaScript visualisation library
