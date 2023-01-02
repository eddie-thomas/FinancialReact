import data_json from "../json/data.json";
import users_json from "../json/users.json";

// eslint-disable-next-line
function middleware(json: any) {
  try {
    if (json instanceof Array) {
      return json;
    }
    return [];
  } catch (error) {
    console.warn(error);
    return [];
  }
}

export const data = middleware(data_json);
export const users = middleware(users_json);
