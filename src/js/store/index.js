import Vue from 'vue';
import Vuex from 'vuex';
import { request } from '../libs/api';

Vue.use(Vuex);

const fetchItems = () => new Promise((resolve, reject) => {
  request('items/fetch')
    .then(res => resolve(res))
    .catch(e => reject(e));
});

const getItem = id => new Promise((resolve, reject) => {
  request(`items/${id}`)
    .then(res => resolve(res))
    .catch(err => reject(err));
});

const createItem = data => new Promise((resolve, reject) => {
  request('items', {
    method: 'post',
    body: data,
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

const updateItem = data => new Promise((resolve, reject) => {
  request(`items/${data.id}`, {
    method: 'put',
    body: data,
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

const uploadItem = data => new Promise((resolve, reject) => {
  request('items/upload', {
    method: 'post',
    body: data,
  })
    .then(res => resolve(res))
    .catch(err => reject(err));
});

export default new Vuex.Store({
  state: {
    items: [],
    item: {},
    image: null,
    loading: false,
    error: null,
  },
  mutations: {
    setItems: (state, items) => {
      Vue.set(state, 'items', items);
    },
    setItem: (state, item) => {
      Vue.set(state, 'item', item);
    },
    setImage: (state, path) => {
      Vue.set(state, 'image', path);
    },
    setLoading: (state, loading) => {
      Vue.set(state, 'loading', loading);
    },
    setError: (state, error) => {
      Vue.set(state, 'error', error);
    },
    updateItems: (state, item) => {
      let isCreated = true;
      const items = state.items.map((row) => {
        if (row.id === item.id) {
          isCreated = false;
          return item;
        }
        return row;
      });
      if (isCreated) {
        items.push(item);
      }
      Vue.set(state, 'items', items);
      Vue.set(state, 'item', item);
    },
  },
  actions: {
    fetch({ commit }) {
      commit('setLoading', true);
      return fetchItems()
        .then((res) => {
          commit('setItems', res);
          commit('setLoading', false);
        })
        .catch(err => commit('setError', err));
    },
    get({ commit }, id) {
      commit('setLoading', true);
      return getItem(id)
        .then((res) => {
          commit('setItem', res);
          commit('setImage', res.image);
          commit('setLoading', false);
        })
        .catch(err => commit('setError', err));
    },
    create({ commit }, data) {
      commit('setLoading', true);
      return createItem(data)
        .then((res) => {
          commit('updateItems', res);
          commit('setLoading', false);
          return res;
        })
        .catch(err => commit('setError', err));
    },
    update({ commit }, data) {
      commit('setLoading', true);
      return updateItem(data)
        .then((res) => {
          commit('updateItems', res);
          commit('setImage', res.image);
          commit('setLoading', false);
        })
        .catch(err => commit('setError', err));
    },
    upload({ commit }, data) {
      commit('setLoading', true);
      return uploadItem(data)
        .then((res) => {
          commit('setLoading', false);
          commit('setImage', res.path);
          return res;
        })
        .catch(err => commit('setError', err));
    },
  },
});