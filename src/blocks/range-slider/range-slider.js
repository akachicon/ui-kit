import 'rangeslider.js';

$('.range-slider__input').rangeslider({
  polyfill: false,
  rangeClass: 'range-slider__track',
  fillClass: 'range-slider__fill',
  handleClass: 'range-slider__thumb',
  disabledClass: 'range-slider__track_disabled',
  horizontalClass: 'range-slider__track_horizontal',
  verticalClass: 'range-slider__track_vertical',

  onInit() {
    const $input = this.$element;

    if ($input.is('[data-hint]')) {
      const $slider = $input.parent();
      const $hint = $slider.children('.range-slider__hint');
      const $thumb = $slider.find('.range-slider__thumb');

      const hintOnSlide = (position, value) => {
        $hint.css('margin-left', position + $thumb.width() / 2);
        $hint.text(value);
      };

      hintOnSlide(this.position, this.value);
      $input.data('hintOnSlide', hintOnSlide);

      const { update } = this;
      const that = this;

      // A way to trigger a hint update whenever
      // the plugin updates data (e.g. on resize):

      // eslint-disable-next-line func-names
      this.update = function (...args) {
        update.call(that, ...args);
        hintOnSlide(this.position, this.value);
      };
    }
  },

  onSlide(position, value) {
    const hintOnSlide = this.$element.data('hintOnSlide');

    if (typeof hintOnSlide === 'function') {
      hintOnSlide(position, value);
    }
  },
});
