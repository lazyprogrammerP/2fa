const inactivityCheck = () => {
  let time;

  window.onload = resetTimer;

  // DOM Events
  document.onmousemove = resetTimer;
  document.onkeydown = resetTimer;

  function logout() {
    localStorage.clear();
    alert("You are now logged out.");
    window.location = "/auth/sign-in";
  }

  function resetTimer() {
    clearTimeout(time);
    time = setTimeout(logout, 3000);
    // 1000 milliseconds = 1 second
  }
};

export default inactivityCheck;
