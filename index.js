import {
  createDataItemSigner,
  spawn,
  message,
  result,
} from "@permaweb/aoconnect";

const createProcessID = async () => {
  try {
    const processId = await spawn({
      module: "sBmq5pehE1_Ed5YBs4DGV4FMftoKwo_cVVsCpPND36Q",
      scheduler: "_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA",
      signer: createDataItemSigner(window.arweaveWallet),
    });
    return processId;
  } catch (error) {
    console.log(error);
  }
};

const initializeTable = async (process_id, table_name) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `sqlite3 = require('lsqlite3')
            db = db or sqlite3.open_memory()
            db:exec([[
            CREATE TABLE IF NOT EXISTS ${table_name} (
            ID INTEGER PRIMARY KEY AUTOINCREMENT
            );
            ]])
             end`,
    });
    console.log("initializeTable messageId : " + messageId);

    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Table is not initiated");
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
};

const showColumns = async (process_id, table_name) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `
      schema_info = {}
      for row in db:nrows("PRAGMA table_info(${table_name});") do
            table.insert(schema_info, {name = row.name, type = row.type})
      end
      all_attribute={}
      
      for _, values in ipairs(schema_info) do
        table.insert(all_attribute,values.name)
      end
      
      return all_attribute`,
    });
    console.log("showColumns messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in showing all columns");
    }
    const _data = extractValues(stripAnsiCodes(res1.Output.data.output));
    return _data;
  } catch (error) {
    console.log(error);
  }
};

const addingColumn = async (
  process_id,
  table_name,
  column_name,
  column_datatype
) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `function add_column(table, column, data_type)

    local add_column = string.format("ALTER TABLE %s ADD COLUMN %s %s;", table, string.upper(column),string.upper(data_type))

     db:exec(add_column)
end

add_column("${table_name}", "${column_name}","${column_datatype}") `,
    });
    console.log("addingColumn messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in adding new columns");
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
};

const addingDataInTable = async (process_id, table_name, data) => {
  try {
    const values = convertToArrayString(data);
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `function insert_values_into_table(table, values)
    local value_string = ""
    for i, value in ipairs(values) do

        if type(value) == "string" then
            value = value:gsub("'", "''")
            value_string = value_string .. string.format("'%s'", value)
        else
            value_string = value_string .. tostring(value)
        end
        if i < #values then
            value_string = value_string .. ", "
        end
    end

   local insert_sql = string.format("INSERT INTO %s VALUES (%s);", table, value_string)


    local result = db:exec(insert_sql)
    if result ~= sqlite3.OK then
        error("Failed to insert values: " .. db:errmsg())
    end

end

local values = ${values}
insert_values_into_table("${table_name}", values) `,
    });
    console.log("addingDataInTable messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in adding data in table");
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
};

const getDataFromDatabase = async (process_id, table_name) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `
      attr_info = {}
      local function get_table_columns(table_name)
           local columns = {}
          for row in db:nrows("PRAGMA table_info(" .. table_name .. ");") do
              columns[#columns + 1] = row.name
          end
          return columns
      end
      
      local function fetch_all_data(table_name)
          local columns = get_table_columns(table_name)
      
          for row in db:nrows("SELECT * FROM " .. table_name) do
              local processed_row = {}
              for _, column in ipairs(columns) do
                  processed_row[column] = row[column] or "NULL"
              end
              table.insert(attr_info, processed_row)
          end
      
      end
      
      fetch_all_data("${table_name}")
      
      
      return attr_info`,
    });
    console.log("getDataFromDatabase messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in getting all data in table");
    }
    const _data = convertToArray(stripAnsiCodes(res1.Output.data.output));
    return _data;
  } catch (error) {
    console.log(error);
  }
};

const deleteData = async (process_id, table_name, delete_data) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `
  sqlite3 = require('lsqlite3')
      db = db or sqlite3.open_memory()

    local result = db:exec(string.format([[
        DELETE FROM "${table_name}" WHERE (${Object.entries(delete_data)
        .map((val) => `"${val[0]}" = "${val[1]}"`)
        .join(" AND ")})
    ]]))
    if result ~= sqlite3.OK then
        error("Failed to insert values: " .. db:errmsg())
    end
 

  `,
    });
    console.log("deletingData messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in deleting data");
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
};

const updateData = async (process_id, table_name, data, condition) => {
  try {
    const messageId = await message({
      process: process_id,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "Eval" }],
      data: `
sqlite3 = require('lsqlite3')
  db = db or sqlite3.open_memory()
local result = db:exec(string.format([[
    UPDATE "${table_name}" SET ${Object.keys(data)
        .map((val) => `"${val}"="${setOne[val]}"`)
        .join(", ")} WHERE (${Object.keys(condition)
        .map((val) => `"${val}"="${whereOne[val]}"`)
        .join(" AND ")})
]]))
if result ~= sqlite3.OK then
    error("Failed to insert values: " .. db:errmsg())
end
 `,
    });
    console.log("updatingData messageId : " + messageId);
    let res1 = await result({
      message: messageId,
      process: process_id,
    });
    console.log(res1);
    if (res1.Output.data.json != undefined) {
      throw new Error("Error in updating data");
    }
    console.log("Done");
  } catch (error) {
    console.log(error);
  }
};

const stripAnsiCodes = (str) =>
  str.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

const extractValues = (str) => {
  const trimmedStr = str.replace(/[{}]/g, "").trim();

  const valuesArray = trimmedStr
    .split(/\s*,\s*/)
    .map((value) => value.replace(/"/g, ""));

  return valuesArray;
};

const convertToArrayString = (str) => {
  const values = str.split(",");

  const convertedValues = values.map((value) => {
    if (!isNaN(value)) {
      return Number(value);
    } else {
      return `"${value}"`;
    }
  });

  const resultString = `{${convertedValues.join(",")}}`;

  return resultString;
};

const convertToArray = (str) => {
  let jsonStr = str.replace(/=/g, ":");

  jsonStr = jsonStr.replace(/'/g, '"');

  jsonStr = jsonStr.replace(/(\w+)\s*:/g, '"$1":');

  jsonStr = jsonStr.replace(/\{(.+?)\}/gs, "{$1}");
  jsonStr = `[${jsonStr.slice(1, -1)}]`;

  const jsonObject = JSON.parse(jsonStr);

  return jsonObject;
};

module.exports={createProcessID,initializeTable,showColumns,addingColumn,addingDataInTable,getDataFromDatabase,deleteData,updateData};