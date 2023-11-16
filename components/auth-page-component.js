import { loginUser, registerUser } from "../api.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { addRedBorder, sanitizeHtml } from "../helpers.js";

export function renderAuthPageComponent({ appEl, setUser }) {
  let isLoginMode = true;
  let imageUrl = "";

  const renderForm = () => {
    const appHtml = `
      <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">
                ${
                  isLoginMode
                    ? "Вход в&nbsp;Instapro"
                    : "Регистрация в&nbsp;Instapro"
                }
                </h3>
              <div class="form-inputs">
    
                  ${
                    !isLoginMode
                      ? `
                      <div class="upload-image-container input-del-error"></div>
                      <input type="text" id="name-input" class="input input-del-error" placeholder="Имя" />
                      `
                      : ""
                  }
                  
                  <input type="text" id="login-input" class="input input-del-error" placeholder="Логин" />
                  <input type="password" id="password-input" class="input input-del-error" placeholder="Пароль" />
                  
                  <div class="form-error"></div>
                  
                  <button class="button" id="login-button">${
                    isLoginMode ? "Войти" : "Зарегистрироваться"
                  }</button>
              </div>
            
              <div class="form-footer">
                <p class="form-footer-title">
                  ${isLoginMode ? "Нет аккаунта?" : "Уже есть аккаунт?"}
                  <button class="link-button" id="toggle-button">
                    ${isLoginMode ? "Зарегистрироваться." : "Войти."}
                  </button>
                </p> 
               
              </div>
          </div>
      </div>    
`;

    appEl.innerHTML = appHtml;
    
    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector(".upload-image-container");

    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: appEl.querySelector(".upload-image-container"),
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }

    document.getElementById("login-button").addEventListener("click", () => {
      setError("");

      if (isLoginMode) {
        const login = sanitizeHtml(document.getElementById("login-input").value);
        const password = document.getElementById("password-input").value;

        if (!login) {
          // alert("Введите логин");
          let message = "Введите логин";
          addRedBorder(document.getElementById("login-input"));
          setError(message);
          return;
        }

        if (!password) {
          // alert("Введите пароль");
          let message = "Введите пароль";
          addRedBorder(document.getElementById("password-input"));
          setError(message);
          return;
        }

        loginUser({
          login: login,
          password: password,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      } else {
        const login = sanitizeHtml(document.getElementById("login-input").value);
        const name = sanitizeHtml(document.getElementById("name-input").value);
        const password = document.getElementById("password-input").value;
        if (!name) {
          // alert("Введите имя");
          let message = "Введите имя";
          addRedBorder(document.getElementById("name-input"));
          setError(message);
          return;
        }
        if (!login) {
          // alert("Введите логин");
          addRedBorder(document.getElementById("login-input"));
          let message = "Введите логин";
          setError(message);
          return;
        }

        if (!password) {
          // alert("Введите пароль");
          addRedBorder(document.getElementById("password-input"));
          let message = "Введите пароль";
          setError(message);
          return;
        }

        if (!imageUrl) {
          // alert("Не выбрана фотография");
          addRedBorder(document.querySelector(".upload-image-container"));
          let message = "Не выбрана фотография";
          setError(message);
          return;
        }

        registerUser({
          login: login,
          password: password,
          name: name,
          imageUrl,
        })
          .then((user) => {
            setUser(user.user);
          })
          .catch((error) => {
            console.warn(error);
            setError(error.message);
          });
      }
    });

    for(let input of document.querySelectorAll(".input-del-error")) {
      input.addEventListener("click", () => {
      appEl.querySelector(".form-error").textContent = '';
    })
    }
    

    document.getElementById("toggle-button").addEventListener("click", () => {
      isLoginMode = !isLoginMode;
      renderForm();
    });
  };

  renderForm();
}
