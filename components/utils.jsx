import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

async function verifyUserToken() {
  const token = localStorage.getItem("token");
  let verified = false;
  try {
    await axios.get(`${BACKEND_URL}/users/verify_token`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
      .then((res) => {
        if (res.status === 200) {
          // console.log("User is logged in");
          verified = true;
        } else {
          // console.log("User is not logged in");
          verified = false;
        }
      })
      .catch((error) => {
        // console.error("Error verifying user token:", error);
        verified = false;
      });
  } catch (error) {
    // console.error("Error verifying user token:", error);
    verified = false;
  }
  if (verified === false) {
    localStorage.removeItem("token");
    return false;
  }
  return true;
}


async function getRole() {
  let role;
  if (localStorage.getItem("token") === null) {
    return null;
  }
  await axios.get(`${BACKEND_URL}/users/get_user`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
    .then(res => role = res.data.role)
    .catch(err => console.log(err))
  return role;
}


export { verifyUserToken, getRole };
