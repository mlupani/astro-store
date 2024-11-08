/// <reference path="../.astro/types.d.ts" />


interface User {
    email: string;
    name: string;
    //avatar: string;
    //emailVerified: boolean;
}

declare namespace App {
    interface Locals {
        isLoggedIn: boolean;
        user: User | null;
        isAdmin: boolean;
    }
}