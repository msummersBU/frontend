import { hideAlert } from '../utils/alert';

document.querySelector('body').addEventListener('click', (e) => {
  if (e.target.matches('.cross')) {
    hideAlert();
  }
});
