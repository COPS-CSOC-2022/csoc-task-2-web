function noAuth() {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/";
  }
}
noAuth();
