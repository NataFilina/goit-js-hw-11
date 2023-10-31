import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

axios.defaults.baseURL = 'https://pixabay.com/api/';

const elements = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

const simpleLightbox = new SimpleLightbox('.gallery a');

const options = {
  root: null,
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onLoadMore, options);

let items;
let getPhotos;
let page = 1;
let counterObserver = 0;

elements.form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();

  elements.gallery.innerHTML = '';

  const photos = new FormData(event.target);

  items = Object.fromEntries(photos);
  if (items.searchQuery === '') {
    return;
  }

  try {
    getPhotos = await searchPhotos(items.searchQuery, page);

    if (getPhotos.data.totalHits) {
      Notiflix.Notify.success(
        `Hooray! We found ${getPhotos.data.totalHits} images.`
      );
    }
    if (
      getPhotos.data.hits.length * page >= getPhotos.data.totalHits &&
      getPhotos.data.totalHits !== 0
    ) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(elements.guard);
    }
    elements.gallery.insertAdjacentHTML(
      'afterbegin',
      await createMarkup(getPhotos)
    );
    simpleLightbox.refresh();
    if (page < getPhotos.data.totalHits) {
      observer.observe(elements.guard);
    }
  } catch (err) {
    Notiflix.Notify.failure(err);
  } finally {
    elements.form.reset();
  }
}

function createMarkup(arr) {
  return arr.data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
           
            <div class="info">
              <div class="wrapper">
                <p class="info-item">
                <b>Likes</b> ${likes}
                </p>
                <p class="info-item">
                <b>Views</b> ${views}
                </p>
              </div>
              <div class="wrapper">  
                <p class="info-item">
                <b>Comments</b> ${comments}
                </p>
                <p class="info-item">
                <b>Downloads</b> ${downloads}
                </p>
              </div>
            </div>
            </a>
        </div>
        `;
      }
    )
    .join('');
}

async function searchPhotos(photos, page = 1) {
  const params = new URLSearchParams({
    key: '40263466-7e415f5d97d0e5ac2b44404cf',
    q: photos,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 40,
  });
  const resp = await axios.get(`?${params}`).then(function (response) {
    return response;
  });
  if (resp.data.hits.length === 0 && resp.data.totalHits === 0) {
    Notiflix.Report.info(
      "Doesn't match",
      'Sorry, there are no images matching your search query. Please try again.',
      'Try again'
    );
  }
  return resp;
}

async function getMorePhotos() {
  try {
    page += 1;

    const getMorePhoto = await searchPhotos(items.searchQuery, page);

    elements.gallery.insertAdjacentHTML(
      'beforeend',
      createMarkup(getMorePhoto)
    );

    simpleLightbox.refresh();

    if (getMorePhoto.data.hits.length * page >= getPhotos.data.totalHits) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      observer.unobserve(elements.guard);
    }
  } catch (err) {
    Notiflix.Notify.failure(err);
  }
}

async function onLoadMore(entries, observer) {
  counterObserver += 1;

  await entries.forEach(entry => {
    if (entry.isIntersecting) {
      getMorePhotos();
    }
  });
}
