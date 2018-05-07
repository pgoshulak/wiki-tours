# Wiki-Tours
A collaborative mapping site where users can share their favourite places to create tours for their friends.

This project began as a midterm project for Lighthouse Labs web development bootcamp for working in a full-stack, collaborative development project.

# Screenshots
![Main main](/docs/1-main.png)
![User Profile](/docs/2-profile.png)
![Map info](/docs/3-map.png)
![Adding a point](/docs/4-add.png)
![Point details](/docs/5-point.png)

# Features
## Navigation
- Users can navigate the homepage which lists available maps
- Anonymous users can view maps from the homepage
- Users can login and view their profile, which lists:
  - their created maps
  - their favourited maps
  - maps they have contributed to
- Once logged in, users can create a new map

## Viewing a map
Any user can view a map and its tour points. Points are shown on the map as markers. Clicking a marker zooms in the screen to the marker and brings up the point's detail view.
The map viewer has three screens:
- The main info view, listing map name, a thumbnail, description, likes, and last-updated date
- The points list, which lists all approved points
- The points detail view, which shows point name, a thumbnail, and description. 

Once logged-in, users can:
- 'Favourite' a map
- Switch to the map editor screen

## Editing a map
Only logged-in users can use the map editor. From here, users can:
- click a location on the map to add a marker
  - points will automatically populate with a name and image if possible
- edit the point name, image, and description
- delete the point
Users can only edit the points they have created when contributing to another user's map. When a user first adds a point, it is marked as 'not approved' and will not be displayed on the map publicly until the map owner approves it.

When a user is the map owner, they can edit points as above. Additionally, they can:
- Edit the map's title, thumbnail image (displayed on the map listings), and description
- Edit points from any user
- 'Approve' a point for public display

# Setup
1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Add a new entry to the `.env` as `API_KEY=<your_google_maps_API_key>`
3. Update the .env file with your correct local information
4. Install dependencies: `npm i`
5. Fix to binaries for sass: `npm rebuild node-sass`
6. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
7. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
8. Run the server: `npm run local`
9. Visit `http://localhost:8080/`

## Usage notes
User authentication is simplified for demo purposes. Three users are created, and can 'logged in' by navigating to `http://localhost:8080/login/<user_id>` where `user_id` is 1, 2, or 3.

Only the 'Toronto Weekend Sites' map is populated with points, although there are several other maps listed.

# Issues
- on deleting a marker, occasionally the marker remains rendered. This happens most frequently when deleting more than one marker before refreshing the page
- Deleting the only point on a map recenters the map view in the Pacific ocean (at equator and International Dateline)

# Roadmap
- Implement map comments (already seeded in database)
- Implement map categories (already seeded in database)
- Allow users to search for locations from a searchbar

# Dependencies
- Node 5.10.x or above
- NPM 3.8.x or above
- PostgreSQL
