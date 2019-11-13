const { DB } = require("./db");
import { getEnvTableName } from "../util";
import { userEvent } from "./model/userEvent";

export = DB.define("UserEvent", {
  hashKey: "userId",
  timestamps: true,
  schema: userEvent,
  indexes : [
    { hashKey : 'isEnabled', name : 'isEnabled', type : 'global' }
  ],
  tableName: getEnvTableName("userEvents")
});
