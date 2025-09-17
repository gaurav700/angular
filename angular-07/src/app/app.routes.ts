import { Routes } from '@angular/router';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { Login } from './login/login';
import { Notfound } from './notfound/notfound';
import { Profile } from './profile/profile';

export const routes: Routes = [
    {path:"about", component:About},
    {path:"profile/:name", component:Profile},
    {path:"profile", component:Profile, data:{name:"Akshita Yadav"}
    },
    {path:"contact", component: Contact},
    {path:"login", component:Login},
    {path:"**", component:Notfound}
];
