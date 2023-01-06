export async function getCurrentUser() {
  let random_boolean = Math.random() < 0.5;
  return new Promise((resolve, reject) => {
    if (!false) {
      const timeout = setTimeout(() => {
        resolve({ email: "karim@gmail.com", name: "Karim" });
      }, 2000);
    } else {
      setTimeout(() => {
        reject(new Error("getCurrentUser Error"));
      }, 2000);
    }
  });
}
// params: { email, name, password }
export async function signUp(params) {
  return new Promise((resolve, reject) => {
    if (true) {
      setTimeout(() => {
        resolve({ email: params.email, name: params.name });
      }, 2000);
    } else {
      reject(new Error("signUp Error"));
    }
  });
}
