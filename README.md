# **_T-Vue - TV Show Dashboard Extravaganza_**

[![Home page](/src/assets/images/image-2.png)](https://mr-robak.github.io/t-vue/)

This dashboard lets you explore TV shows by genre and rating. You to search for shows and view detailed information about each one. The project is using **Vue 3 with the Composition API**, **TypeScript** and [TVMaze API](https://www.tvmaze.com/api) as a data backend.
It was build with love and lots of fun, enjoy!

[Demo here](https://mr-robak.github.io/t-vue/)

## **_Table of Contents_**

- [Tech Stack](#tech-stack)
- [How to Run](#how-to-run)
- [Future Improvements](#future-improvements)

## **_Tech Stack_**

- **Vue 3** with the Composition API
- **TypeScript** for type safety
- **Vite** for fast builds and hot module reloading
- **Vue Router** for navigation between pages
- **Pinia** for state management
- **SCSS** for responsive and modular styling
- **Vitest** for unit testing
- **GitHub Actions** for automated deployment to GitHub Pages

[![Show details](/src/assets/images/image-1.png)](https://mr-robak.github.io/t-vue/)

## **_Architecture decisions_**

- **Component-based Design:**  
  Separate components for views (HomePage, GenreView, SearchResults, ShowDetails) and common UI elements (CardItem, GridList, SearchBar, BackNavigationButton, etc).

- **Routing & State Management:**  
  Application uses Vue Router for navigation between pages. For the state management I chose Pinia, mainly for learning purposes as I never had a chance to work with it. Initially I had some ideas of cashing the data and updating only when needed. Then I figured out the data set is huge so it wasn't as straightforward as to drop it in the local storage. In retrospective in the current state of the app the store is not needed and the whole state could be as well managed locally in the components via props.

- **Performance:**  
  Uses virtual scrolling in GridList to handle big datasets and responsive SCSS to adapt the UI for different screen sizes. I use globally defined SCSS variables and mixins for ease of use and consistent styling.

- **Testing & Deployment:**  
  For testing I went with Vitest. Automated builds and deployments are are handled by GitHub Actions. Pipelines makes sure the code is linted,built and tested before deploying to the Github Pages.

  Deployed app can be found here https://mr-robak.github.io/t-vue/

## **_How to Run_**

In my dev environment I use node v20.18.0 and npm v10.8.2. Github workers use v18 so either should be good.

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Run the Development Server**:

   To start the development server run:

   ```bash
   npm run dev
   ```

   By default, the server runs at `http://localhost:3000`.

3. **Build for Production**:

   To create a production build, run:

   ```bash
    npm run build
   ```

## **_Future Improvements_**

1. Introduce caching strategies for API data. Most API response object have `lastUpdated` property so the cache could be updated selectively when needed.

2. Enhance error handling in state modules. Currently the error handling is very basic and could be improved.

3. Further separate business logic from view logic. Some components have a lot of logic in them and could be split into smaller part ot moved to modules.

4. Project definitely needs more tests. I've prioritized to build a fully functional app first and then add tests. I focused on testing the most important parts of the app logic (modules, api, helpers), but there is still a lot of room for improvement.

// line break in markdown

[**Back to top**](#t-vue---tv-show-dashboard-extravaganza)
