# Wiki-Tours
A collaborative mapping site where users can share their favourite places to create tours for their friends.

This project began as a midterm project for Lighthouse Labs web development bootcamp for working in a full-stack, collaborative development project.

# Screenshots

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

# Issues

# Roadmap


## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
