import View from './Views';
import preView from './preView.js';
import icons from '../../img/icons.svg';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `Couldn't Find Your Recipe :( `;
  _message;

  _generateMarkup() {
    return this._data.map(result => preView.render(result, false)).join('');
  }
}

export default new ResultView();
