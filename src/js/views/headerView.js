import { elements, limitCharacters } from './base';
import image from '../../img/default.png';
import * as storage from '../utils/localStorage';

// TODO: Add user data as args into this func
export const renderHeaderLogin = async (user) => {
  // FIXME: User value comes up undefined when they login due to promise
  if (!user) {
    user = storage.getObj('user');
  }

  const url = await `https://polar-savannah-53668.herokuapp.com/img/users/${user.photo}`;

  const markup = `
  &nbsp;
  <nav class="user-nav">
    <div class="header__login">
      <a href="#" class="btn btn--logout">Logout</a>
    </div>

    <div class="user-nav__user">
      <img
        src="${url}"
        alt="${user.name} Photo"
        class="user-nav__user-photo"
      />
      <span class="user-nav__user-name">${limitCharacters(user.name)}</span>
    </div>
</nav>`;

  elements.header.innerHTML = markup;
};

export const renderHeaderDefault = () => {
  const markup = `
  &nbsp;
  <div class="header__login">
    <a href="#" class="btn btn--login">Login</a>
    <a href="#" type="submit" class="btn btn--ghost btn--signup">Sign up</a>
  </div>`;

  elements.header.innerHTML = markup;
};
