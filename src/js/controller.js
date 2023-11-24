import * as model from '../js/module.js';
import { MODAL_CLOSE_SECS } from './config.js';
import recipeView from './view/recipeView.js';
import searchView from './view/searchResultView.js';
import resultView from './view/resultView.js';
import paginationView from './view/paginationView.js';
import bookmarksView from './view/bookmarksView.js';
import addRecipeView from './view/addRecipeView.js';
// polifillin the asyc await
import 'core-js/stable';
// pollifilling the everything else in the code
import 'regenerator-runtime/runtime';

const btnClear = document.querySelector('.clearBtn');
// if (module.hot) {
//   module.hot.accept();
// }

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
const showRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();
    resultView.update(model.getSearchResult());
    bookmarksView.update(model.state.bookmark);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    console.log(err);
    recipeView.renderError();
  }
};
const controlSearchResult = async function () {
  try {
    // rendering the spinnner
    resultView.renderSpinner();

    // getting the query
    const query = searchView.getQuery();

    if (!query) return;
    // getting the result
    const data = await model.loadSearchResults(query);

    //     // render the Search Results

    resultView.render(model.getSearchResult());

    paginationView.render(model.state.searchResult);
  } catch (err) {
    console.log(err);
  }
};

const controlPage = function (gotoPage) {
  resultView.render(model.getSearchResult(gotoPage));
  paginationView.render(model.state.searchResult);
};

const controlServing = function (newServing) {
  // upadating the serving
  model.updateServings(newServing);

  // updating the serving in the recipe
  recipeView.update(model.state.recipe);
};

const controlBookMark = function () {
  if (!model.state.recipe.bookmarked) model.addBookMark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  bookmarksView.render(model.state.bookmark);

  recipeView.update(model.state.recipe);
};

const clearStorage = function () {
  btnClear.addEventListener('click', function (e) {
    const btn = e.target.closest('.clearBtn');
    !btn;
    model.clearBookmarks();
  });
};
clearStorage();

const controlBookmarks = function () {
  model.restoreBookmarks(); // first we load
  bookmarksView.render(model.state.bookmark); // then we render
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // render the spinner
    addRecipeView.renderSpinner();

    await model.uplodRecipe(newRecipe);

    console.log(model.state.recipe);
    // render the recipe
    recipeView.render(model.state.recipe);

    // display the success message
    addRecipeView.renderMessage();

    // render the bookmark
    bookmarksView.render(model.state.bookmark);

    // history API in the browser
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // close the window form.
    setTimeout(function () {
      addRecipeView.toggler();
    }, MODAL_CLOSE_SECS * 1000);
  } catch (err) {
    console.error('hshhsh', err);

    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  bookmarksView.addHandler(controlBookmarks);
  recipeView.eventHandlerRender(showRecipe);
  recipeView.updateServingsHandler(controlServing);
  recipeView.bookMarkHandler(controlBookMark);
  searchView.renderResults(controlSearchResult);
  paginationView.pageHandlerClick(controlPage);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
