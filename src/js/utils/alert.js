import { elements } from '../views/base';

export const showAlert = (type, msg) => {
  hideAlert();
  const alertMarkup = `<div class="alert alert-type--${type}">${msg}<a href="#" class="cross">&Cross;</a></div> `;
  document.querySelector('body').insertAdjacentHTML('afterbegin', alertMarkup);
  window.setTimeout(() => hideAlert, 1000);
};

export const hideAlert = () => {
  const alert = document.querySelector('.alert');
  if (alert) alert.remove();
};
