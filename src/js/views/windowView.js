export const renderWindow = (parent) => {
  const markup = `<div class="window__content">
  <div class="window__ok">
    Yes, please delete it
  </div>

  <div class="window__cancel">
    No, I want to cancel
  </div>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};

export const clearWindow = () => {
  const windowAlert = document.querySelector('.window__content');
  if (windowAlert) windowAlert.remove();
};
