import { elements } from './base';

export const renderLoginForm = (parent) => {
  const loginForm = `          
  <div class="login">
    <form action="#" class="form">
      <div class="form__group">
        <input type="email" class="form__input" id="email" placeholder="Email Address" required>
        <label for="email" class="form__label">Email Address</label>
      </div>
      
      <div class="form__group">
        <input type="password" class="form__input" id="password" placeholder="Password" required>
        <label for="password" class="form__label">Password</label>
      </div>

      <div class="form__group">
        <span class="form__span"><a href="#" class="form__link">Forgot your password?</a></span>
      </div>
      
      <div class="form__group">
        <button class="btn--btn-login">Login</button>
      </div>
    </form>
  </div>`;

  parent.insertAdjacentHTML('afterbegin', loginForm);
};

export const renderSignupForm = (parent) => {
  const markup = `<div class="login signup">
  <form action="#" class="form">
    <div class="form__group">
      <input type="name" class="form__input" id="name" placeholder="Name" required>
      <label for="nYame" class="form__label">Name</label>
    </div>

    <div class="form__group">
      <input type="email" class="form__input" id="email" placeholder="Email Address" required>
      <label for="email" class="form__label">Email Address</label>
    </div>
    
    <div class="form__group">
      <input type="password" class="form__input" id="password" placeholder="Password" required>
      <label for="password" class="form__label">Password</label>
    </div>

    <div class="form__group">
      <input type="password" class="form__input" id="passwordConfirm" placeholder="Confirm Password" required>
      <label for="passwordConfirm" class="form__label">Confirm Password</label>
    </div>

    <div class="form__group">
      <span class="form__span"><a href="#" class="form__link">Forgot your password?</a></span>
    </div>

    <div class="form__group">
      <div class="form__radio-group">
          
          <input type="radio" id="student" class="form__radio-input" name="tour-group" value="student" required>

          <label for="student" class="form__radio-label">
              <span class="form__radio-button"></span>
              Student
          </label>
     
          <input type="radio" id="teacher" class="form__radio-input" name="tour-group" value="teacher" required>

          <label for="teacher" class="form__radio-label">
              <span class="form__radio-button"></span>
              Teacher
          </label>
      </div>
  </div>
    
    <div class="form__group">
      <button class="btn--btn-signup">Signup</button>
    </div>
  </form>
</div>
`;

  parent.insertAdjacentHTML('afterbegin', markup);
};
