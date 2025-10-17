const db = require('./db/connection');

(async () => {
  try {
    // const allUsers = await db.query(`SELECT * FROM users;`);
    // console.log('All Users');
    // console.log(allUsers.rows);

    // const codingArticles = await db.query(`SELECT * FROM articles WHERE topic = 'coding';`);
    // console.log('Coding Aritcles');
    // console.log(codingArticles.rows);

    // const badComments = await db.query(`SELECT * FROM comments WHERE votes < 0;`);
    // console.log('Bad Comments');
    // console.log(badComments.rows);

    // const allTopics = await db.query(`SELECT * FROM topics;`);
    // console.log('All Topics');
    // console.log(allTopics.rows);

    // const articlesByGrumpy19 = await db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`);
    // console.log('Articles By Grumpy19');
    // console.log(articlesByGrumpy19.rows);

    const goodComments = await db.query(`SELECT * FROM comments WHERE votes > 10;`);
    console.log('Good Comments');
    console.log(goodComments.rows);
  } catch (error) {
    console.error(error.message);
  } finally {
    db.end();
  }
})();
