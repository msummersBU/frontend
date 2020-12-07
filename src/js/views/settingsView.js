export const renderSettings = (parent, user) => {
  const markup = `<div class="update-settings">
  <form action="#" class="update-settings__form">
    <h2 class="form__heading form__heading--1">Your Account Settings</h2>

    <div class="form__group form__group--1">
      <input type="name" class="form__input" id="name" placeholder="your name" value="${user.name}">
      <label for="name" class="form__label">Your name</label>
    </div>

    <div class="form__group form__group--2">
      <input type="email" class="form__input" id="email" placeholder="Email Address" value="${user.email}">
      <label for="email" class="form__label">Email Address</label>
    </div>

    <div class="form__group form__group--3">
      <img src="https://polar-savannah-53668.herokuapp.com/img/users/${user.photo}" alt="${user.name}" class="form__img--photo" />
    </div>

    <div class="form__group form__group--4">
      <label for="photo" class="form__label--photo">Select a photo</label>
      <input type="file" class="form__input--photo" id="photo" accept="image/*" >
    </div>

    <div class="form__group form__group--5">
      <button class="btn--btn-save-settings">Save Settings</button>
    </div>
    
    <div class="form__group form__group--6">
      <input type="password" class="form__input" id="oldPassword" placeholder="Old Password" required>
      <label for="oldPassword" class="form__label">Old Password</label>
    </div>

    <div class="form__group form__group--7">
      <input type="password" class="form__input" id="newPassword" placeholder="New Password" required>
      <label for="newPassword" class="form__label">New Password</label>
    </div>

    <div class="form__group form__group--8">
      <input type="password" class="form__input" id="confirmPassword" placeholder="Confirm Password" required>
      <label for="confirmPassword" class="form__label">Confirm Password</label>
    </div>
    
    <div class="form__group form__group--9">
      <button class="btn--btn-save-password">Change Password</button>
    </div>
  </form>
</div>`;

  parent.insertAdjacentHTML('afterbegin', markup);
};
