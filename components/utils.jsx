import axios from "axios";

async function verifyUserToken() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
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

export { verifyUserToken };
