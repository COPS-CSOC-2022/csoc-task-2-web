function requiredAuth() {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/login/";
  }
}
requiredAuth();
