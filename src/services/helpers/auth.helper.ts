export function authenticate(jwt: object, callback: VoidFunction) {
  localStorage.setItem("jwt", JSON.stringify(jwt));
  callback();
}

export function isAuthenticated() {
  const storedJWT = localStorage.getItem("jwt");

  return storedJWT ?? false;
}

export function clearToken(
  beforeSignOut: VoidFunction,
  signOutFunction: () => Promise<void>
) {
  localStorage.removeItem("jwt");

  beforeSignOut();

  signOutFunction().then(() => {
    document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}
