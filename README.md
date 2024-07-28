# ao-lsqlite3
ao-lsqlite3 is an npm package designed for creating databases using Lua's lsqlite3 on AO. This package simplifies database creation, allowing developers to use straightforward functions instead of writing lengthy and complex code.

# Usage
- [Installation](#installation)
- **Functions**
    - [createProcessID](#createprocessid)
    - [initializeTable](#initializetable)
    - [showColumns](#showcolumns)
    - [addingColumn](#addingcolumn)
    - [addingDataInTable](#addingdataintable)
    - [getDataFromDatabase](#getdatafromdatabase)
    - [deleteData](#deletedata)
    - [updateData](#updatedata)
- [License](#license)   
 
# Installation

To install ao-lsqlite3@1.0.3 in the root directory of your project, run:
 
 ```bash
 npm install ao-lsqlite3@1.0.3
 ```

# createProcessID

 The **createProcessID** function generates a new process ID. It returns a promise that resolves to the new process ID.

  ```javascript
import { createProcessID } from "ao-lsqlite3"

async function generateNewProcessID() {
  try {
    // Generate a new process ID
    const newProcessID = await createProcessID();
    console.log(newProcessID);
  } catch (error) {
    console.error('Error generating process ID:', error);
  }
}

generateNewProcessID();
 ```

### Return (string)
 ```javascript
ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk
 ```


# initializeTable
 The **initializeTable** function helps initialize a new table with a default attribute or column **"ID"** which is an **INTEGER PRIMARY KEY AUTOINCREMENT**. It returns a Promise. It has two parameters:

- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.

```javascript
import { initializeTable } from 'ao-lsqlite3';

async function setupTable(processID, tableName) {
  try {
    await initializeTable(processID, tableName);
    console.log(`Table "${tableName}" initialized successfully.`);
  } catch (error) {
    console.error('Error initializing table:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = "Authors"; // Replace with your desired table name

setupTable(processID, tableName);
```

# showColumns
The **showColumns** function returns a promise that resolves to an array of objects, each containing the type and name of columns in a specified table (e.g., **[{type: "INTEGER", name: "ID"}]**). It has two parameters:

- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.

```javascript
import { showColumns } from 'ao-lsqlite3';

async function displayTableColumns(processID, tableName) {
  try {
    const columns = await showColumns(processID, tableName);
    console.log(columns);
  } catch (error) {
    console.error('Error displaying table columns:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = "Authors"; // Replace with your table name

displayTableColumns(processID, tableName);

```

### Return ("[{}]")
 ```javascript
[{type: "INTEGER", name: "ID"}]
 ```

# addingColumn
The **addingColumn** function is a promise that adds a new column to an existing table in the database. If there is existing data in the other columns, the new column's data will be **NULL** up to the point where data is filled in the other columns. It has four parameters:
- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.
- **column_name**(string): The new column name you want to create.
- **column_datatype**(string): The datatype of the column you want to create (e.g., TEXT, INTEGER).

```javascript
import { addingColumn } from 'ao-lsqlite3';

async function addNewColumn(processID, tableName, columnName, columnDataType) {
  try {
    await addingColumn(processID, tableName, columnName, columnDataType);
    console.log(`Added column "${columnName}" of type "${columnDataType}" to table "${tableName}".`);
  } catch (error) {
    console.error('Error adding new column:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = "Authors"; // Replace with desired table name
const columnName = 'name'; // Replace with your desired column name
const columnDataType = 'text'; // Replace with your desired column datatype

addNewColumn(processID, tableName, columnName, columnDataType);
```

# addingDataInTable
The **addingDataInTable** function is a promise that helps add data to a specified table. The data should be entered as a string, formatted according to the table's attributes (e.g., "1, Tom, 20" with respect to ID, NAME, AGE). It has three parameters:
- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.
- **data**(string): The data to be entered into the table, formatted as a string according to the attributes (e.g., "1, J. K. Rowling" with respect to ID, NAME).

```javascript
import { addingDataInTable } from 'ao-lsqlite3';

async function insertData(processID, tableName, data) {
  try {
    await addingDataInTable(processID, tableName, data);
    console.log(`Data added to table "${tableName}"`);
  } catch (error) {
    console.error('Error adding data to table:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = "Authors"; // Replace with your table name
const data = "1, J. K. Rowling"; // Replace with your data

const data2="2, R.K. Narayan"; 

insertData(processID, tableName, data);
insertData(processID, tableName, data2);
```

# getDataFromDatabase
The **getDataFromDatabase** function is a promise that retrieves all the data present in the specified table. It returns the data as an array of objects, where each object is a key-value pair representing the column name and the data present in the row (e.g., [{"NAME":"J. K. Rowling","ID": 1},{"NAME": "R.K. Narayan","ID": 2}]). It has two parameters:
- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.

```javascript
import { getDataFromDatabase } from 'ao-lsqlite3';

async function fetchData(processID, tableName) {
  try {
    const data = await getDataFromDatabase(processID, tableName);
    console.log(data);
  } catch (error) {
    console.error('Error fetching data from database:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = Authors; // Replace with your table name

fetchData(processID, tableName);
```

### Return ("[{}]")

```javascript
[
  {
    "NAME": "J. K. Rowling",
    "ID": 1
  },
  {
    "NAME": "R.K. Narayan",
    "ID": 2
  }
]
```

# deleteData
The **deleteData** function is a promise that helps in deleting a row from the specified table. It has three parameters:
- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.
- **delete_data**(object): An object containing key-value pairs representing the column name and the data present in the row you want to delete (e.g., {NAME: "R.K. Narayan", ID: 2}).

```javascript
import { deleteData } from 'ao-lsqlite3';

async function removeData(processID, tableName, deleteData) {
  try {
    await deleteData(processID, tableName, deleteData);
    console.log('Data deleted successfully');
  } catch (error) {
    console.error('Error deleting data from database:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk";  // Replace with your actual process ID
const tableName = "Authors"; // Replace with your table name
const deleteDataObject = { NAME: "R.K. Narayan", ID: 2 }; // Replace with the data you want to delete

removeData(processID, tableName, deleteDataObject);
```

# updateData
The updateData function is a promise that helps in updating data in a specified table. It has four parameters:
- **process_id**(string): The process ID you are using in your project.
- **table_name**(string): The name of the table you want to create in lsqlite3.
- **data**(object): An object containing key-value pairs representing the column name and the updated data (e.g., { NAME: "Ruskin Bond" }).
- **condition**(object): An object used as a condition to identify the row(s) to be updated, containing key-value pairs representing the column name and the data (e.g., { ID: 1 }).

**Note**: Ensure you provide at least one unique key-value pair in the condition object to accurately identify the row to update. If the key-value pair is not unique, use additional key-value pairs for specificity.

```javascript
import { updateData } from 'ao-lsqlite3';

async function modifyData(processID, tableName, updatedData, condition) {
  try {
    await updateData(processID, tableName, updatedData, condition);
    console.log('Data updated successfully');
  } catch (error) {
    console.error('Error updating data in database:', error);
  }
}

// Example usage
const processID = "ItdJAlLINZcFX6JmY8Ev3CckTJXSdSezNiS3Fk"; // Replace with your actual process ID
const tableName = "Authors"; // Replace with your table name
const updatedData = { NAME: "Ruskin Bond" }; // Data to be updated
const condition = { ID: 1 }; // Condition to identify the row to update

modifyData(processID, tableName, updatedData, condition);
```

# License

The projects is licensed under [MIT](https://choosealicense.com/licenses/mit/)