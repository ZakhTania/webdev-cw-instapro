import { USER_POSTS_PAGE, POSTS_PAGE } from "../routes.js";
import { renderHeaderComponent } from "./header-component.js";
import { posts, goToPage, user } from "../index.js";
import { deleteUserPosts, getLikes } from "../api.js";

export function renderPostsPageComponent({ appEl, token }) {
  // TODO: реализовать рендер постов из api
  console.log("Актуальный список постов:", posts);

  /**
   * TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
   * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
   */
  const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                </ul>
              </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  const listElements = document.querySelector(".posts");

  const postsHtml = posts
    .map((post) => {
      return `  <li class="post">
                  <div class="post-header">
                    <div class="post-header__left" data-userid=${post.user.id}>
                      <img src=${
                        post.user.imageUrl
                      } class="post-header__user-image">
                      <p class="post-header__user-name">${post.user.name}</p>
                    </div>
                      ${
                        token
                          ? post.user.name === user.name
                            ? ` <button data-postid=${post.id} class="delete-button">
                              <img src="./assets/images/delete_btn.png" class="delete-button_img" title="Удалить пост">
                            </button>`
                            : ``
                          : ``
                      }
                  </div>
                  <div class="post-image-container">
                    <img class="post-image" src=${post.imageUrl}>
                  </div>
                  <div class="post-likes" id="${post.id}">
                    <button data-postid=${post.id} class="like-button" id=${
        post.isLiked ? `like` : `not-like`
      }> 
                    ${
                      post.isLiked
                        ? `<img src="./assets/images/like-active.svg">`
                        : `<img src="./assets/images/like-not-active.svg">`
                    }
                    </button>
                    <p class="post-likes-text">
                      Нравится: <strong>${post.likes.length}</strong>
                    </p>
                  </div>
                  <div class="form-error" data-postid=${post.id}></div>
                  <p class="post-text">
                    <span class="user-name">${post.user.name}</span>
                    ${post.description}
                  </p>
                  <p class="post-date">
                  ${post.createdAt}
                  </p>
                </li>`;
    })
    .join("");

  listElements.innerHTML = postsHtml;

  for (let userEl of document.querySelectorAll(".post-header__left")) {
    userEl.addEventListener("click", () => {
      const userId = userEl.dataset.userid;
      console.log(userId);
      goToPage(USER_POSTS_PAGE, userId);
    });
  }

  for (let btnLikes of document.querySelectorAll(".like-button")) {
    btnLikes.addEventListener("click", () => {
      const id = btnLikes.dataset.postid;
      if (!token) {
        for (let formError of document.querySelectorAll(".form-error"))
          if (formError.getAttribute("data-postid") === id) {
            formError.textContent = `Только авторизированные пользователи могут лайкать посты`;
            setTimeout(() => {
              formError.textContent = "";
            }, 2000);
            // alert("Только авторизированные пользователи могут лайкать посты");
            return;
          }
      }
      let endURL = "";

      if (btnLikes.getAttribute("id") === "not-like") {
        endURL = "like";
      }
      if (btnLikes.getAttribute("id") === "like") {
        endURL = "dislike";
      }

      let postId = btnLikes.dataset.postid;

      console.log(btnLikes);
      console.log(endURL);
      getLikes({
        token,
        postId,
        endURL,
      }).then(() => {
        goToPage(POSTS_PAGE);
      });
    });
  }

  for (let btnDel of document.querySelectorAll(".delete-button")) {
    btnDel.addEventListener("click", () => {
      let id = btnDel.dataset.postid;
      deleteUserPosts({ token, id }).then(() => {
        goToPage(POSTS_PAGE);
      });
    });
  }
}
