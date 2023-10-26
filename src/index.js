import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.baseURL = 'https://pixabay.com/api/';

const elements = {
    form: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
}

elements.form.addEventListener("submit", onSearch);

async function onSearch(event) {
  event.preventDefault();

    const photos = event.target.searchQuery.value;

  try {
      const getPhotos = await searchPhotos(photos);
      console.log(getPhotos);

    elements.gallery.insertAdjacentHTML("afterbegin", await createMarkup(getPhotos));
  } catch (err) {
    console.log(err);
  } finally {
    elements.form.reset();
  }
}

async function searchPhotos(photos) {
    const params = new URLSearchParams({
        key: "40263466-7e415f5d97d0e5ac2b44404cf",
        q: photos,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true
    });
    const resp = await axios.get(`?${params}`)
        .then(function (response) {
            if (response.status >= 400) {
                throw new Error(response.statusText || "Упс! Щось пішло не так")
            }
            return response;
        });
    return resp
}

function createMarkup(arr) {
    return arr.data.hits.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
        return `
        <div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
                <p class="info-item">
                <b>Likes</b> ${likes}
                </p>
                <p class="info-item">
                <b>Views</b> ${views}
                </p>
                <p class="info-item">
                <b>Comments</b> ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b> ${downloads}
                </p>
            </div>
        </div>
        `
    });
}