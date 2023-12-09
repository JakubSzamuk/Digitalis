CREATE TABLE users (
  id int NOT NULL AUTO_INCREMENT,
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  app_key varchar(255),
  ip_address varchar(255),
  PRIMARY KEY (id)
);
