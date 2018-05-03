exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('favourites').del()
    .then(() => {
      return knex('comments').del()
    }).then(() => {
      return knex('points').del()
    }).then(() => {
      return knex('maps').del()
    }).then(() => {
      return knex('categories').del()
    }).then(() => {
      return knex('users').del()
    }).then(() => {
      console.log('seeding users');
      return Promise.all([
        // Inserts seed entries
        knex('users').insert({
          id: 1,
          first_name: 'Luke',
          last_name: 'Skywalker',
          email: 'luke@rebellion.com'
        }),
        knex('users').insert({
          id: 2,
          first_name: 'Darth',
          last_name: 'Vader',
          email: 'vader@empire.com'
        }),
        knex('users').insert({
          id: 3,
          first_name: 'Leia',
          last_name: 'Organa',
          email: 'leia@rebellion.com'
        })
      ]);
    }).then(() => {
      return Promise.all([
        knex('categories').insert({
          id: 1,
          name: 'Must-see',
          thumbnail_url: 'http://www.traveller.com.au/content/dam/images/g/x/s/9/9/x/image.related.articleLeadwide.620x349.gxrr7a.png/1502377795523.jpg'
        }),
        knex('categories').insert({
          id: 2,
          name: 'Food',
          thumbnail_url: 'http://images.mentalfloss.com/sites/default/files/styles/mf_image_16x9/public/521724-istock-545286388.jpg?itok=AF_X9rNF&resize=1100x619'
        }),
        knex('categories').insert({
          id: 3,
          name: 'History',
          thumbnail_url: 'https://blog.my.com/wp-content/uploads/2016/11/Depositphotos_22942194_m-2015.jpg'
        })
      ])
    }).then(() => {
      return Promise.all([
        knex('maps').insert({
          id: 1,
          owner_id: 1,
          category_id: 1,
          title: 'Toronto Weekend sites',
          description: 'Most scenic spots to hit for a weekend in the 6ix',
          thumbnail_url: 'https://s11.therealdeal.com/trd/up/2016/02/Toronto-The-Real-Deal-1.png'
        }),
        knex('maps').insert({
          id: 2,
          owner_id: 1,
          category_id: 2,
          title: 'Best Toronto Chinatown food',
          description: 'The best food in Toronto\'s Chinatown, at Spadina and Dundas',
          thumbnail_url: 'https://asiasociety.org/files/160802_chinese_food.jpg'
        }),
        knex('maps').insert({
          id: 3,
          owner_id: 3,
          category_id: 1,
          title: 'Hollywood North',
          description: 'See where your favourite movies and TV series were shot',
          thumbnail_url: 'https://www.jta.org/wp-content/uploads/2017/06/140729-F-JZ550-853.jpg'
        }),
        knex('maps').insert({
          id: 4,
          owner_id: 2,
          category_id: 3,
          title: 'War-time landmarks',
          description: 'Learn about Toronto\'s history in the biggest wars this continent has faced',
          thumbnail_url: 'http://104.236.16.159/wp-content/uploads/2009/05/img_1950.jpg'
        }),
      ])
    }).then(() => {
      return Promise.all([
        knex('points').insert({
          map_id: 1,
          contributor_id: 1,
          title: 'CN Tower',
          description: 'The majestic icon of Toronto, built from 1972-76. Was the world\'s tallest freestanding structure 1975-2007',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Toronto_-_ON_-_CN_Tower_bei_Nacht2.jpg/220px-Toronto_-_ON_-_CN_Tower_bei_Nacht2.jpg',
          embed_url: 'https://en.wikipedia.org/wiki/CN_Tower',
          latitude: '43.642600',
          longitude: '-79.387100',
          owner_approved: true
        }),
        knex('points').insert({
          map_id: 1,
          contributor_id: 1,
          title: 'Scarborough Bluffs',
          description: 'A beautiful escarpment along the city\'s east shore, with nine provincal parks throughout',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/ScarboroughBluffs10.jpg/220px-ScarboroughBluffs10.jpg',
          embed_url: 'https://en.wikipedia.org/wiki/Scarborough_Bluffs',
          latitude: '43.7059359',
          longitude: '-79.2338663',
          owner_approved: true
        }),
        knex('points').insert({
          map_id: 1,
          contributor_id: 2,
          title: 'Casa Loma',
          description: 'Grand 18th-century castle featuring regular tours & gardens that are open seasonally, and a likely location of the hidden rebel base.',
          image_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Casa_Loma.JPG/240px-Casa_Loma.JPG',
          embed_url: 'https://en.wikipedia.org/wiki/Casa_Loma',
          latitude: '43.6780371',
          longitude: '-79.4116379',
          owner_approved: false
        })
      ])
    }).then(() => {
      return Promise.all([
        knex('favourites').insert({
          id: 1,
          map_id: 1,
          user_id: 3
        }),
        knex('favourites').insert({
          id: 2,
          map_id: 2,
          user_id: 3
        }),
        knex('favourites').insert({
          id: 3,
          map_id: 3,
          user_id: 1
        }),
        knex('favourites').insert({
          id: 4,
          map_id: 1,
          user_id: 2
        }),
      ])
    }).then(() => {
      return Promise.all([
        knex('comments').insert({
          id: 1,
          map_id: 1,
          user_id: 3,
          text: 'These are great, gonna check these out after trip to Alderaan'
        }),
        knex('comments').insert({
          id: 2,
          map_id: 1,
          user_id: 2,
          text: 'Luke you should add pins where you and your rebels pals hang out all the time'
        })
      ])
    })
};
