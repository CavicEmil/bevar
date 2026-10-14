# BEVAR USING REACT, TAILWINDCSS & SUPABASE

## First steps
1. make sure you have created a .env file with the two variables:
VITE_SUPABASE_URL=*insert supabase url from supabase proj here*
VITE_SUPABASE_PUBLISHABLE_KEY=*insert public key from supabase proj here*
2. !! MAKE ABSOLUTELY SURE YOU HAVE .env TYPED INTO .gitignore !!
*IF YOU ARE UNSURE ASK IN THE GROUP*
3. have your own user created in the supabase dashboard so you can login and test the page properly

## The ~Architecture~
=> everything you do is in folder 'src'
the folders and what they do:
- api is to handle authentication and create, read, update,delete (CRUD) data into and from the database !everything you need for the frontend should be working, if not lets talk about it in the group!
- assets is for images (dont use public, no no, if you think yes yes lets talk about it in the group)
in general: always use SVG for simple images that need to be able to grow/shrink on the screen
use WebP for static images, high-resolution visuals, web banners,...
-  components: every smol addition to a page like ingredient calculator, ratings,... so we can reuse it repeatedly
- context: handling state, should be all set up for what we need, if you need more ask in the group
- hooks: scripts that offer reusable logic, like complex animations, complex computations,... 
- views: the pages of our app, each view is a page

## The ~Styling~
We use tailwindCSS - the theme and everything in regards to custom styling is defined in the App.css file.
We will aim to make reusable elements like buttons/cards so we can just copypasta