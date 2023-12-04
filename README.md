# Data Lovers

## Product

The focus of this project is to simulate asynchronous loading of data and display the information either
on cards or in a table. For this project there is various data available and therefore, data with country information has been chosen. Data loading is done asynchronously from a `.json` file and data for each country is displayed. In addition, a bar diagram with Gini Index and the population density is shown by continent using `Chart.js`. Besides, there is a clock and are shwon the flags for the countries with that timezone.

### Principal Users

The application allows you to consult relevant information about countries around the world.

**Functionallities:**
* The user can search the data by the common name, official name or capital of each country.
* The user can filter the data by the continent, by the subregion or the language spoken.
* The user can sort the data in ascending order or descending way by country, capital, population or area.

#### Data of the countries:
* In the Table:
  * Common name with flag and a mark to check if the country is independent.
  * The capital of the country.
  * Short text that represent the languages spoken in the country.
  * Area of the country.
  * Population of the country.
  * Gini Index of the country.

When the mouse is over the name appears the official name of the country and if the mouse is over the Gini Index appears the year when it was reported.

* In the Cards:
  * In the Front you can see the flag of the country.
  * In the Back the data is:
    * Common name
    * Official name
    * Capital
    * Area
    * Population
    * Gini Index

## Repository

You can try the deployment in the [link]()


If you can explore de code in [Github]().

### Check it locally: 

* Clone the repository
  `git clone git@github.com:karolans25/DEV010-data-lovers.git`

* Install the dependencies
  `cd DEV010-data-lovers`
  `npm install`

* Run the application locally
  `npm start`

* Open the browser and go to `localhost:3000`
