const passwordVisibility = document.querySelector('.vl__password button');
const passwordInput = document.querySelector('.vl__password input');
const [iconOff, iconOn] = passwordVisibility.querySelectorAll('img');
const codeInput = document.querySelector('input[inputmode="numeric"]');

passwordVisibility.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  iconOff.hidden = isHidden;
  iconOn.hidden = !isHidden;
});

passwordVisibility.addEventListener('pointerdown', e => {
  if (e.pointerType === 'touch') e.preventDefault();
});

codeInput.addEventListener('input', () => {
  codeInput.value = codeInput.value.replace(/\D/g, '');
});