import View from './Views.js';

class SearchResult extends View {
  _parentElement = document.querySelector('.search');
  _data;
  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clear();
    return query;
  }

  _clear() {
    return (this._parentElement.querySelector('.search__field').value = '');
  }

  renderResults(handler) {
    return this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      return handler();
    });
  }
}
export default new SearchResult();
