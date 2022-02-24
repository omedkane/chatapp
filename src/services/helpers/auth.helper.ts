function authenticate(jwt: string, callback?: VoidFunction) {
  localStorage.setItem("jwt", JSON.stringify(jwt));
  if (callback !== undefined) callback();
}

function isAuthenticated(): string | boolean {
  const storedJWT = localStorage.getItem("jwt");

  return storedJWT !== null ? JSON.parse(storedJWT) : false;
}

function clearToken(
  beforeSignOut: VoidFunction,
  signOutFunction: () => Promise<void>
) {
  localStorage.removeItem("jwt");

  beforeSignOut();

  signOutFunction().then(() => {
    document.cookie = "t=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  });
}

const authHelper = { authenticate, isAuthenticated, clearToken };
export default authHelper;
