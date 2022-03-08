import { RouteRecordRaw } from 'vue-router'
import Main from "../components/Main.vue";
// import ArticleUpdate from './views/article/ArticleUpdate.vue'
import Articles from "../views/article/Articles.vue";
import Menu from "../views/menu/Index.vue";
import Tags from "../views/tags/Index.vue";
import Theme from "../views/theme/Index.vue";
import Setting from "../views/setting/Index.vue";
import Loading from "../views/Loading.vue";
import Test from '../components/Test.vue'
const routes: Array<RouteRecordRaw> = [
    { path: '/:pathMatch(.*)*', component: () => import("@renderer/views/404.vue") },
    // { path: '/', name: '总览', component: () => import('@renderer/components/LandingPage.vue') },
    {
        path: "/",
        name: "main",
        component:Main,
        children: [
            {
                path: "/articles",
                name: "articles",
                component: Articles,
            },
            {
                path: "/menu",
                name: "menu",
                component: Menu,
            },
            {
                path: "/tags",
                name: "tags",
                component: Tags,
            },
            {
                path: "/theme",
                name: "theme",
                component: Theme,
            },
            {
                path: "/setting",
                name: "setting",
                component: Setting,
            },
            {
                path: "/loading",
                name: "loading",
                component: Loading,
            },
            {
                path: "/",
                redirect: "/articles",
            },
        ],
    }
]

export default routes
