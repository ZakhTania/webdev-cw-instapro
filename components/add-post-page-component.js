import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { sanitizeHtml, addRedBorder } from "../helpers.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container" id="img-input">
          </div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" rows="4" id="text-input"></textarea>
          </label>

          <div class="form-error"></div>

          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    let imageUrl = "";

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const setError = (message) => {
      appEl.querySelector(".form-error").textContent = message;
    };

    document.getElementById("add-button").addEventListener("click", () => {
      const text = document.querySelector(".textarea");
      console.log(text);
      if (!text) {
        let message = "Добавьте описание фотографии";
        addRedBorder(document.getElementById("text-input"));
        setError(message);
        return;
      }
      if (!imageUrl) {
        let message = "Добавьте фото";
        addRedBorder(document.getElementById("img-input"));
        setError(message);
        return;
      }

      onAddPostClick({
        description: sanitizeHtml(text.value),
        imageUrl,
      });
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });
  };

  render();
}
