const buttons = document.getElementsByClassName('button-standard');

function createRipple(e) {
  const obsoleteRipples = this
    .getElementsByClassName('button-standard__ripple');

  if (obsoleteRipples) {
    [].forEach.call(obsoleteRipples, (ripple) => {
      this.removeChild(ripple);
    });
  }

  const circle = document.createElement('div');
  const buttonRect = this.getBoundingClientRect();

  this.appendChild(circle);

  circle.style.left = `${e.clientX - buttonRect.left}px`;
  circle.style.top = `${e.clientY - buttonRect.top}px`;
  circle.classList.add('button-standard__ripple');
}

[].forEach.call(buttons, (button) => {
  button.addEventListener('click', createRipple);
});
