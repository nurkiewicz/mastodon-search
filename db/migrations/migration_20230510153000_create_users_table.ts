import {Knex} from "knex";

exports.up = function(knex: Knex) {
    return knex.raw(`
        CREATE TABLE users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        INSERT INTO users (name, email)
        VALUES
        ('user1', 'user1@example.com'),
        ('user2', 'user2@example.com'),
        ('user3', 'user3@example.com'),
        ('user4', 'user4@example.com'),
        ('user5', 'user5@example.com'),
        ('user6', 'user6@example.com'),
        ('user7', 'user7@example.com'),
        ('user8', 'user8@example.com'),
        ('user9', 'user9@example.com'),
        ('user10', 'user10@example.com');

  `);
};

exports.down = function(knex: Knex) {

}