import axios from "axios";
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

axios.defaults.headers.common["key"] = "40263466-7e415f5d97d0e5ac2b44404cf";
axios.defaults.baseURL = 'https://pixabay.com/api/';

// function fetchBreeds() {  
//     return axios.get('/breeds')
//         .then(function (response) {
//             if (response.status >= 400) {
//                 throw new Error (response.statusText || "Упс! Щось пішло не так")
//             }
//             return response;
//         })
        
// }

// <div class="photo-card">
//   <img src="" alt="" loading="lazy" />
//   <div class="info">
    // <p class="info-item">
    //   <b>Likes</b>
    // </p>
//     <p class="info-item">
//       <b>Views</b>
//     </p>
//     <p class="info-item">
//       <b>Comments</b>
//     </p>
//     <p class="info-item">
//       <b>Downloads</b>
//     </p>
//   </div>
// </div>
