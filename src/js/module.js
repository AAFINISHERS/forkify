import { async } from 'regenerator-runtime';
import { AJAX } from './helper';
// import { AJAX, AJAX } from './helper';
import { API_URL, RES_PER_PAGE, API_KEY } from './config';

export const state = {
  recipe: {},
  searchResult: {
    query: '',
    result: [],
    page: 1,
    resultPerPage: RES_PER_PAGE,
  },
  bookmark: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    ingredients: recipe.ingredients,
    source: recipe.source_url,
    servings: recipe.servings,
    publisher: recipe.publisher,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);

    if (state.bookmark.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};
export const loadSearchResults = async function (query) {
  try {
    state.searchResult.query = query;
    const data = await AJAX(`${API_URL}?search=${query}?key=${API_KEY}`);
    if (!data) return;
    state.searchResult.result = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        image: rec.image_url,
        title: rec.title,
        publisher: rec.publisher,
        ...(rec.key && { key: rec.key }),
      };
    });
    state.searchResult.page = 1;
    console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const getSearchResult = function (page = state.searchResult.page) {
  state.searchResult.page = page;

  const start = (page - 1) * state.searchResult.resultPerPage;
  const end = page * state.searchResult.resultPerPage;
  return state.searchResult.result.slice(start, end);
};
export const updateServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    // new qt= old qt * new serving / old serving
    ing.quantity = (ing.quantity * newServing) / state.recipe.servings;
  });
  state.recipe.servings = newServing;
};

const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};
export const addBookMark = function (recipe) {
  state.bookmark.push(recipe);
  console.log(state.bookmark);

  persistBookmark();
  if (recipe.id === state.recipe.id) return (state.recipe.bookmarked = true);
};
export const deleteBookmark = function (id) {
  const index = state.bookmark.findIndex(el => el.id === id);
  state.bookmark.splice(index, 1);
  console.log(state.bookmark);

  persistBookmark();
  if (id === state.recipe.id) return (state.recipe.bookmarked = false);
};
export const restoreBookmarks = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
export const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
export const uplodRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArray = ing[1].split(',').map(el => el.trim());
        if (ingArray.length !== 3)
          throw new Error(`Incorrect Format for adding the recipe`);
        const [quantity, unit, description] = ingArray;

        return { quantity: quantity ? +quantity : null, unit, description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      cooking_time: +newRecipe.cookingTime,
      publisher: newRecipe.publisher,
      servings: +newRecipe.servings,
      ingredients,
    };
    console.log(recipe);
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookMark(state.recipe);
  } catch (err) {
    throw err;
  }
};
