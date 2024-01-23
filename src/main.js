import axios from 'axios';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '41917538-242eecdf4d8f318e540737d69';
const apiUrl = 'https://pixabay.com/api/';

const searchForm = document
  .getElementById('search-form')
  .addEventListener('submit', function (event) {
    event.preventDefault();

    const searchTerm = document.querySelector('input').value.trim();

    if (searchTerm === '') {
      iziToast.error({
        title: 'Error',
        message: 'Please enter a search term.',
      });
      return;
    }
    clearGallery();
    searchImages(searchTerm);
  });

function searchImages(query) {
  //   const params = `key=${apiKey}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=21`;

  const params = {
    key: apiKey,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 21,
  };

  //   fetch(`${apiUrl}?${params}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(response.status);
  //       }
  //       return response.json();
  //     })
  //     .then(data => {
  //       if (data.hits && data.hits.length > 0) {
  //         displayImages(data.hits);
  //       } else {
  //         showNoImagesMessage();
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error fetching images:', error);
  //       showErrorMessage();
  //         });
  axios
    .get(apiUrl, { params })
    .then(response => {
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(response.status);
      }
    })
    .then(data => {
      if (data.hits && data.hits.length > 0) {
        displayImages(data.hits);
      } else {
        showNoImagesMessage();
      }
    })
    .catch(error => {
      console.error('Error fetching images:', error);
      showErrorMessage();
    });
}

function displayImages(images) {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  images.forEach(image => {
    const card = document.createElement('div');
    card.className = 'image-card';

    const link = document.createElement('a');
    link.href = image.webformatURL;

    const img = document.createElement('img');
    img.src = image.webformatURL;
    img.alt = image.tags;
    img.className = 'gallery-image';

    const metadata = document.createElement('div');
    metadata.className = 'image-metadata';
    metadata.innerHTML = `
      <p>Likes: ${image.likes}</p>
      <p>Views: ${image.views}</p>
      <p>Comments: ${image.comments}</p>
      <p>Downloads: ${image.downloads}</p>
    `;
    card.appendChild(link);
    link.appendChild(img);
    // card.appendChild(img);
    card.appendChild(metadata);

    gallery.appendChild(card);
  });
  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });
  lightbox.refresh();
}

function showNoImagesMessage() {
  iziToast.error({
    title: 'Sorry!',
    message:
      'There are no images matching your search query. Please try again!',
  });
}

function showErrorMessage() {
  iziToast.error({
    title: 'Error!',
    message: 'An error occurred while fetching images. Please try again later.',
  });
}

function clearGallery() {
  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';
}
