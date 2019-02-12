const conatiners = document.getElementsByClassName(
  'percentage-circle__circle-container'
);

// Firefox does not set an initial value for viewBox according to
// the size of the element, so the workaround is to trigger it manually.

[].forEach.call(conatiners, (container) => {
  const rect = container.getBoundingClientRect();

  // eslint-disable-next-line no-param-reassign
  container.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
  // eslint-disable-next-line no-param-reassign
  container.removeAttribute('viewBox');
});
