import { mark } from 'regenerator-runtime';
import icons from '../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElement = Array.from(newDom.querySelectorAll('*'));
    const curElement = Array.from(this._parentElement.querySelectorAll('*'));
    newElement.forEach((el, i) => {
      const curEl = curElement[i];
      if (!el.isEqualNode(curEl) && el.firstChild?.nodeValue.trim() !== '')
        curEl.textContent = el.textContent;
      if (!el.isEqualNode(curEl))
        Array.from(el.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner = function () {
    const markup = `
      <div class="spinner">
              <svg>
                <use href="${icons}#icon-loader"></use>
              </svg>
            </div> `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  };
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
          <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
          <p>${message}</p>
      </div>
    `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
          <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
          <p>${message}</p>
      </div>
    `;
    this.clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  clear() {
    return (this._parentElement.innerHTML = '');
  }
}
