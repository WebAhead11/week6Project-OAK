BEGIN;

DROP TABLE IF EXISTS users, posts CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255)  NOT NULL ,
  password VARCHAR(255)
);

CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title TEXT,
  text_content TEXT
);

INSERT INTO users (email,password) VALUES
  ('kassimbashir@gmail.com','$2b$10$wne7GC9B.bhy22fdJP9.9.uEc8mcIC22Zwhk.pTK1mGDl3lFYxcBy'),
  ('kassimbashir@hotmail.com','$2b$10$dIqtdDhSa.EfQ5wBBiXPH.C2AiN/8heoyJc9.PNzB/O2d.oE.TXie')
;

INSERT INTO posts (title,text_content, user_id) VALUES
  ('t1','Announcing of invitation principles in.', 1),
  ('t2','Peculiar trifling absolute and wandered yet.', 2)
;

COMMIT;