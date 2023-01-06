// params: {email, password}
export async function login(params) {
  // let random_boolean = Math.random() < 0.5;
  return new Promise((resolve, reject) => {
    if (true) {
      setTimeout(() => {
        resolve({ email: params.email, name: "testname" });
      }, 2000);
    } else {
      reject(new Error("login Error"));
    }
  });
}
export async function logout() {
  return new Promise((resolve, reject) => {
    if (true) {
      setTimeout(() => {
        resolve("Logout");
      }, 2000);
    } else {
      reject(new Error("logout Error"));
    }
  });
}
