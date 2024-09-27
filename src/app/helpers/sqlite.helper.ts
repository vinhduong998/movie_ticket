import { openDatabase } from "react-native-sqlite-storage";
import DATA_MOVIES from "./data.json"

const TABLE_MOVIE = `MOVIES`

export const DB = openDatabase({
  name: "movie_ticket.db",
  location: "default",
  createFromLocation: 2
}, () => console.log("Open DB success"), (error) => console.log("Open DB error: ", error));

interface TUpdateMovie extends Partial<TMovie> {
  id: string
}

export async function updateItem(data: TUpdateMovie): Promise<boolean> {
  const dataUpdate = Object.keys(data).reduce((_str: string[], current) => {
    if (current !== "id") {
      if (typeof data[current as keyof TUpdateMovie] === "string") {
        return [..._str, ` ${current} = "${data[current as keyof TUpdateMovie]}"`]
      }
      return [..._str, ` ${current} = ${data[current as keyof TUpdateMovie]}`]
    }
    return _str
  }, [])

  return new Promise((resolve, reject) => {
    DB.transaction(async function (tx) {
      await tx.executeSql(`UPDATE ${TABLE_MOVIE} SET ` + dataUpdate.join(",") + ` WHERE id = "${data.id}"`);
    }, function (error) {
      console.log("updateTable ERROR: " + TABLE_MOVIE + " " + error.message);
      resolve(false)
    }, function () {
      console.log("updateTable OK " + TABLE_MOVIE);
      resolve(true)
    });
  });
}

export async function createTable(tableName: string, structure: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    DB.transaction(function (tx) {
      tx.executeSql("CREATE TABLE IF NOT EXISTS " + tableName + " (" + structure + ")");
    }, function (error) {
      console.log("createTable ERROR: " + tableName + " " + error.message);
      resolve(false)
    }, function () {
      console.log("createTable OK " + tableName);
      resolve(true)
    });
  });
}

export async function createDB() {
  return new Promise(async (resolve, reject) => {
    const structureMovie = "id, title, description, thumbnail, is_favorite, is_booked, date_favorite, date_booked"
    await createTable(TABLE_MOVIE, structureMovie).then(() => {
      DB.transaction((tx) => {
        tx.executeSql(`SELECT COUNT(*) from ${TABLE_MOVIE}`, [], async (tx, results) => {
          console.log("results.rows.item(0)?.['COUNT(*)']", results.rows.item(0)?.["COUNT(*)"]);

          if (results.rows.item(0)?.["COUNT(*)"] == 0) {
            DB.transaction(function (tx) {
              DATA_MOVIES.map(async (movie) => {
                tx.executeSql(`INSERT INTO ${TABLE_MOVIE} (${structureMovie}) VALUES (?,?,?,?,?,?,?,?)`,
                  [movie.id, movie.title, movie.description, movie.thumbnail, movie.is_favorite, movie.is_booked, null, null]);
              })
            }, function (error) {
              console.log(`Insert ${TABLE_MOVIE} ERROR: ${error.message}`);
              reject(error)
            }, function () {
              console.log(`Insert ${TABLE_MOVIE} SUCCESS`);
              resolve(true)
            });
          }
        });
      }, function (error) {
        console.log(`create DB ERROR: ${error.message}`);
        reject(error)
      }, function () {
        console.log(`create DB SUCCESS`);
        resolve(true)
      });
    });
  })
}

export async function deleteDataTable(tableName: string) {
  return new Promise((resolve, reject) => {
    DB.transaction(function (tx) {
      tx.executeSql("DROP TABLE IF EXISTS " + tableName);
      return true
    }, function (error) {
      console.log("DELETE ERROR: " + tableName + " " + error.message);
      resolve(false);
    }, function () {
      console.log("DELETE OK " + tableName);
      resolve(true);
    });
  });
}

export async function clearDB() {
  DB.transaction(async (tx) => {
    tx.executeSql(`SELECT name FROM sqlite_master WHERE type='table'`, [], async (tx, results) => {
      try {
        for (let i = 0; i < results.rows.length; i++) {
          let table = results.rows.item(i);
          await tx.executeSql("DROP TABLE IF EXISTS " + table?.name);
        }
      } catch (error) {
        console.log(error, "delete table")
      }
    });
  }, function (error) {
    console.log(`Drop table ERROR: ${error.message}`);
  }, function () {
    console.log(`Drop table SUCCESS`);
  });

  createDB().catch((error) => console.log(error, "re-create DB error"));
}

export const getDataPagination = (page: number, limit: number, is_favorite?: boolean, is_booked?: boolean): Promise<TMovie[]> => {
  let condition = "WHERE"
  let orderBy = ""
  if (is_favorite != null) {
    condition += ` is_favorite = ${is_favorite}`
    orderBy = "ORDER BY date_favorite DESC"
  }
  if (is_booked) {
    condition = condition + (condition === "WHERE" ? " " : " AND ") + `is_booked = ${is_booked}`
    orderBy = "ORDER BY date_booked DESC"
  }
  if (condition === "WHERE") {
    condition = ""
  }

  return new Promise((resolve, reject) => {
    try {
      DB.transaction((tx) => {
        tx.executeSql(`SELECT * FROM ${TABLE_MOVIE} ${condition} ${orderBy} LIMIT ${limit} OFFSET ${(page - 1) * limit}`, [], (tx, results) => {
          let messages: TMovie[] = [];
          for (let i = 0; i < results.rows.length; i++) {
            try {
              const message = {
                id: results.rows.item(i).id,
                title: results.rows.item(i).title,
                description: results.rows.item(i).description,
                thumbnail: results.rows.item(i).thumbnail,
                is_favorite: results.rows.item(i).is_favorite,
                is_booked: results.rows.item(i).is_booked
              }
              messages = [...messages, message]
            } catch (error) {
              console.log(error)
            }
          }
          resolve(messages);
        })
      }, function (error) {
        console.log(`Get message ${TABLE_MOVIE} ERROR: ${error.message}`);
        reject(error)
      }, function () {
        console.log(`Get message ${TABLE_MOVIE} page ${page} SUCCESS`);
      });
    } catch (error) {
      reject(error);
    }
  });
}