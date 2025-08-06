import cookie from "react-cookies";

const UserReducer = (current, action) => {
  switch (action.type) {
    case "login":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    case "logout":
      cookie.remove("token");
      localStorage.removeItem("user");
      return null;
    case "update":
      localStorage.setItem("user", JSON.stringify(action.payload));
      return action.payload;
    default:
      return current;
  }
};

export default UserReducer;
