import { Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Notfound } from './notfound/notfound';

export const routes: Routes = [
    {path:"about", component:About},
    {path:"contact", component: Contact},
    {path:"login", component:Login},
    {path:"**", component:Notfound}
];
