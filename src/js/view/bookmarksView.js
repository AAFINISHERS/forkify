import View from './Views';
import preView from './preView.js';
import icons from '../../img/icons.svg';

class BookrksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = `No bookmarks  `;
  _message;

  addHandler(handler) {
    window.addEventListener('load', handler);
  }
  _generateMarkup() {
    return this._data.map(result => preView.render(result, false)).join('');
  }
}

export default new BookrksView();
