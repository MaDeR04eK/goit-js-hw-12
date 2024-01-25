import axios from 'axios';
import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const apiKey = '41917538-242eecdf4d8f318e540737d69';
const apiUrl = 'https://pixabay.com/api/';

let currentPage = 1;
let searchTerm = '';
const perPage = 40;

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.getElementById('load-more-button');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  searchTerm = document.querySelector('.input').value.trim();

  if (searchTerm === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search term.',
    });
    return;
  }

  clearGallery();
  try {
    const data = await searchImages(searchTerm, currentPage);
    if (data.hits && data.hits.length > 0) {
      displayImages(data.hits);
      showLoadMoreButton();
    } else {
      showNoImagesMessage();
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    showErrorMessage();
    hideLoadMoreButton();
  }
});

loadMoreButton.addEventListener('click', async function () {
  try {
    currentPage += 1; 
    disable(loadMoreButton, preloader)
    const data = await searchImages(searchTerm, currentPage);
    if (data.hits && data.hits.length > 0) {
      displayImages(data.hits, true);
    } else {
      hideLoadMoreButton();
    }
  } catch (error) {
    console.error('Error fetching more images:', error);
    hideLoadMoreButton();
  } finally {
enable(loadMoreButton, preloader)
  }
});

function getGalleryCardHeight() {
  const galleryCard = document.querySelector('.image-card');
  if (galleryCard) {
    const cardRect = galleryCard.getBoundingClientRect();
    return cardRect.height;
  }
  return 0;
}

async function searchImages(query, page) {
  try {
    const params = {
      key: apiKey,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: perPage,
      page: page,
    };

    const response = await axios.get(apiUrl, { params });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.status);
    }
  } catch (error) {
    throw new Error('Error fetching images:', error);
  }
}

async function displayImages(images, append) {
  if (!append) {
    gallery.innerHTML = '';
  }
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
    card.appendChild(metadata);

    gallery.appendChild(card);
  });

  const cardHeight = getGalleryCardHeight();

  window.scrollBy({
    top: 2 * cardHeight,
    behavior: 'smooth',
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
  gallery.innerHTML = '';
  currentPage = 1;
}

function showLoadMoreButton() {
  loadMoreButton.style.display = 'block';
}

function hideLoadMoreButton() {
  loadMoreButton.style.display = 'none';
}

function disable(loadMoreButton, preloader) {
      preloader.style.display = 'inline-block'
  loadMoreButton.disabled = true;
}

function enable(loadMoreButton, preloader) {
      preloader.style.display = 'none'
  loadMoreButton.disabled = false;
}
