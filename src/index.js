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

let items;
let getPhotos;

elements.form.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();

  elements.gallery.innerHTML = '';

  const photos = new FormData(event.target);
  items = Object.fromEntries(photos);

  try {
    getPhotos = await searchPhotos(items.searchQuery, page);

    elements.gallery.insertAdjacentHTML(
      'afterbegin',
      await createMarkup(getPhotos)
    );
    new SimpleLightbox('.gallery a');
    if (page < getPhotos.data.totalHits) {
      observer.observe(elements.guard);
    }
  } catch (err) {
    Notiflix.Notify.failure(err);
  } finally {
    elements.form.reset();
  }
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
    if (!response.data.hits.length) {
      Notiflix.Report.info(
        'Sorry, there are no images matching your search query. Please try again.',
        ''
      );
    }
    return response;
  });
  return resp;
}

function createMarkup(arr) {
  return arr.data.hits
    .map(
      ({
        id,
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card" data-id="${id}">
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

const options = {
  root: null,
  rootMargin: '300px',
};

const observer = new IntersectionObserver(onLoadMore, options);
let page = 1;

let counterObserver = 0;
async function onLoadMore(entries, observer) {
  counterObserver += 1;

  await entries.forEach(entry => {
    if (entry.isIntersecting) {
      page += 1;
      searchPhotos(items.searchQuery, page)
        .then(elem => {
          return elem;
        })
        .then(arr => {
          elements.gallery.insertAdjacentHTML('beforeend', createMarkup(arr));
          if (page === getPhotos.data.totalHits) {
            Notiflix.Notify.info(
              "We're sorry, but you've reached the end of search results."
            );
          }
          if (page >= getPhotos.data.totalHits) {
            observer.unobserve(elements.guard);
          }
          new SimpleLightbox('.gallery a');
        })
        .catch(err => Notiflix.Notify.failure(err));
    }
  });
}
