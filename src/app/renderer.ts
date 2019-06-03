const button = document.querySelector(".alert");

if (button)
  button.addEventListener(
    "click",
    (): void => {
      alert(__dirname);
    }
  );
