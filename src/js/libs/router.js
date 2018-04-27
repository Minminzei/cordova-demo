import VueRouter from 'vue-router';
import List from '../containers/List';
import View from '../containers/View';
import Create from '../containers/Create';
import Edit from '../containers/Edit';

export const routes = {
  list: {
    path: '/',
    name: 'list',
    component: List,
  },
  create: {
    path: '/create',
    name: 'create',
    component: Create,
  },
  edit: {
    path: '/edit/:id',
    name: 'edit',
    component: Edit,
  },
  view: {
    path: '/:id',
    name: 'view',
    component: View,
  },
};
const router = new VueRouter({
  routes: Object.keys(routes).map(index => routes[index]),
});

export default router;