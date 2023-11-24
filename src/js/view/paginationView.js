import View from './Views';
import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  pageHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const clickBtn = e.target.closest('.btn--inline');
      if (!clickBtn) return;
      const goto = +clickBtn.dataset.goto;

      handler(goto);
    });
  }
  _generateMarkup() {
    const currPAge = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );

    // page 1 and the other pages
    if (currPAge === 1 && numPages > 1) {
      return `
        <button data-goto="${
          currPAge + 1
        }" class="btn--inline pagination__btn--next">
            <span>${currPAge + 1}</span>
            <svg class="search__icon">
                <use href="${icons}.svg#icon-arrow-right"></use>
            </svg>
        </button>`;
    }
    // Last Page
    if (currPAge === numPages && numPages > 1) {
      return ` 
      <button data-goto="${
        currPAge - 1
      }"class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${currPAge - 1}</span>
    </button>`;
    }
    // other page
    if (currPAge < numPages) {
      return `
      <button data-goto="${
        currPAge - 1
      }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>${currPAge - 1}</span>
     </button>
     <button data-goto="${
       currPAge + 1
     }" class="btn--inline pagination__btn--next">
        <span>${currPAge + 1}</span>
        <svg class="search__icon">
            <use href="${icons}.svg#icon-arrow-right"></use>
        </svg>
    </button>`;
    }
    // page 1 and there are no other pages
    return '';
  }
}
export default new PaginationView();
