# 🗺️ spacethyme 🌍

🗺️ spacethyme 🌍 is a ready to deploy web application that allows you to visualize and interact with your data on a map.

It is the submission by [@zeyus](https://github.com/zeyus) and [@sashapustota](https://github.com/sashapustota) for the *Cultural Data Science - Spatial Analytics* course at Aarhus University.

## Features

- 🌍 **Map** - Visualize your data on a map, integrated by default with [OpenStreetMap](https://www.openstreetmap.org/) using [Leaflet](https://leafletjs.com/).
- 🗃️ **Data** - Upload your data in CSV, TSV or JSON format and visualize it on the map.
- 🗺️ **Vizualisation** - Data can be presented just as markers on the map, or can include a radius (KM) or intensity based on a numerical column (standardized during processing).

## Demo Version

A demo version of the application is available at [https://maptool.zys.im/](https://maptool.zys.im/), this is mainly for previewing the application and the demonstration data. This server is reset at regular intervals and no uploaded data will be retained.

## Installation

### Docker

The very easy way to get this running is via [Docker](https://www.docker.com/) (including Docker Desktop for Windows and OS-X). If you have Docker installed, you can use the latest built Docker image on the [Github Container Registry](https://github.com/zeyus/cds-spatial-exam/pkgs/container/cds-spatial-exam).


Once you have Docker installed, you can run the following command to start the application:

```bash
docker run -p 8080:8080 ghcr.io/zeyus/cds-spatial-exam:main
```

Then 🗺️ spacethyme 🌍 is available at [http://localhost:8080](http://localhost:8080).

### Manual

If you want to run the application manually, you will need to have [Node.js](https://nodejs.org/en/) installed. Once you have Node.js installed, you can run the following commands to start the application:

Clone the repository:

```bash
git clone https://github.com/zeyus/cds-spatial-exam.git
cd cds-spatial-exam
```

Install dependencies:

```bash
cd spacethyme
npm install
```

Build the application:

```bash
npm run build
```

Copy the environment settings:
    
```bash
cp .env ./build/.env
```

*Note:* You can modify the `.env` file if you would like to change the port the application is running on. By default it is `8080`. For example, you can change the line `PORT=8080` to `PORT=80` if you would like to run the application on port 80 (standard web http port).

Start the application:

```bash
cd build
node -r dotenv/config index.js
```

Then 🗺️ spacethyme 🌍 is available at [http://localhost:8080](http://localhost:8080) (or another port if you changed the `PORT` setting).

## Data

### Example Data

🗺️ spacethyme 🌍 comes with some example data to get you started.
#### Earthquakes

Significant Earthquakes, 1965-2016, US Geological Survey License: Public Domain CC0 1.0 Universal. Obtained from Kaggle: [https://www.kaggle.com/datasets/usgs/earthquake-database](https://www.kaggle.com/datasets/usgs/earthquake-database).


### Custom Data

The application accepts data in CSV, TSV or JSON format. If CSV or TSV data is uploaded, the first row is assumed to be the header row. The application will attempt to automatically detect the column types, but you can also manually specify the column types if you would like.

Required data columns:

- `latitude` - The latitude of the data point, in decimal degrees.
- `longitude` - The longitude of the data point, in decimal degrees.

Optional data columns:

- `label` - The label of the data point, which will be displayed on the map.
- `description` - The description of the data point, which will be displayed on the map.
- `category` - The category of the data point, which can be used for filtering or display.
- `radius` - The radius of the data point, in kilometers. If this column is not present, the data point will be displayed as a marker on the map.
- `intensity` - The intensity of the data point, which will be displayed as a color on the map. Intensity should be contain values between 0 and 1. If the values are outside of this range, they will be normalized to fit within this range.
- `date` - If a date column is used, it can be used to filter the data points by date. The date column should be in the format `YYYY-MM-DD` (not strictly required, but it **must** be able to be parsed by `Date.parse()`).

Note: The column names do not have to match the ones specified above, but the data must conform to the specified format.

## Development

### UI

This project uses [SvelteKit](https://kit.svelte.dev/) as the framework for the web application. The application is written in [TypeScript](https://www.typescriptlang.org/). The UI is written in [Svelte](https://svelte.dev/), and uses the [Svelte Material UI](https://sveltematerialui.com/) component library.

### Map

The map is rendered using [Leaflet](https://leafletjs.com/). The map is integrated with [OpenStreetMap](https://www.openstreetmap.org/), and uses the [OpenStreetMap Standard Tile Layer](https://wiki.openstreetmap.org/wiki/Standard_tile_layer) by default.