import Errors from "components/admin/FormItems/error/errors";
import axios from "axios";
import config from "constants/config";

// Cache for API responses
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function list() {
  const cacheKey = "products-list";
  const cached = cache.get(cacheKey);

  // Return cached data if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const response = await axios.get(`/products`);

  // Cache the response
  cache.set(cacheKey, {
    data: response.data,
    timestamp: Date.now(),
  });

  return response.data;
}

const actions = {
  doAdd: (product) => async (dispatch) => {
    dispatch({
      type: "PRODUCTS_LIST_DO_ADD",
      payload: { product },
    });
  },

  doFetch:
    (filter, keepPagination = false) =>
    async (dispatch, getState) => {
      try {
        // Check if we already have data and don't need to refetch
        const state = getState();
        const hasData =
          state.productsList.rows && state.productsList.rows.length > 0;

        if (hasData && !filter && keepPagination) {
          return; // Use existing data
        }

        dispatch({
          type: "PRODUCTS_LIST_FETCH_STARTED",
          payload: { filter, keepPagination },
        });

        const response = await list();

        dispatch({
          type: "PRODUCTS_LIST_FETCH_SUCCESS",
          payload: {
            rows: response.rows,
            count: response.count,
          },
        });
      } catch (error) {
        Errors.handle(error);
        dispatch({
          type: "PRODUCTS_LIST_FETCH_ERROR",
        });
      }
    },

  doDelete: (id) => async (dispatch) => {
    try {
      dispatch({
        type: "PRODUCTS_LIST_DELETE_STARTED",
      });

      await axios.delete(`/products/${id}`);

      dispatch({
        type: "PRODUCTS_LIST_DELETE_SUCCESS",
      });

      // Clear cache after delete
      cache.clear();

      const response = await list();
      dispatch({
        type: "PRODUCTS_LIST_FETCH_SUCCESS",
        payload: {
          rows: response.rows,
          count: response.count,
        },
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: "PRODUCTS_LIST_DELETE_ERROR",
      });
    }
  },

  doOpenConfirm: (id) => async (dispatch) => {
    dispatch({
      type: "PRODUCTS_LIST_OPEN_CONFIRM",
      payload: { id },
    });
  },

  doCloseConfirm: () => async (dispatch) => {
    dispatch({
      type: "PRODUCTS_LIST_CLOSE_CONFIRM",
    });
  },

  // Clear cache when needed
  doClearCache: () => {
    cache.clear();
  },
};

export default actions;
