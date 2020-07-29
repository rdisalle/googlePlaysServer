const { expect } = require('chai');
const supertest = require('supertest');
const app = require('../app');

describe('GET /apps', () => {
    it('should return an array of apps', () => {
        return supertest(app)
        .get('/apps')
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
              expect(res.body).to.be.an('array');
              expect(res.body).to.have.lengthOf.at.least(1);
              const appsResults = res.body[0];
              expect(appsResults).to.include.all.keys(
                'App', 'Rating', 'Genres', 'Category'
            );
          })
      })

      it('should be 400 if sort is incorrect', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'MISTAKE' })
          .expect(400, 'Sort must be one of Rating or App');
      });

      it('should be 400 if genres is not one of six types', () => {
        return supertest(app)
          .get('/apps')
          .query({ genres: 'Fantasy'})
          .expect(400, 'Genre must be one of Action, Puzzle, Strategy, Casual, Arcade, Card')
    });

      it('should sort by App', () => {
        return supertest(app)
          .get('/apps')
          .query({ sort: 'App' })
          .expect(200)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('array');
            let sorted = true;
    
            let i = 0;
            // iterate once less than the length of the array
            // because we're comparing 2 items in the array at a time
            while (i < res.body.length - 1) {
              // compare book at `i` with next book at `i + 1`
              const appAtI = res.body[i];
              const appAtIPlus1 = res.body[i + 1];
              // if the next book is less than the book at i,
              if (appAtIPlus1.App < appAtI.App) {
                // the books were not sorted correctly
                sorted = false;
                break; // exit the loop
              }
              i++;
            }
            expect(sorted).to.be.true;
          });
      });



})