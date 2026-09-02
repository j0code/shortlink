CREATE TABLE IF NOT EXISTS users (
	id STRING PRIMARY KEY,
	key STRING NOT NULL,
	token STRING,
	created_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS shortlinks (
	id STRING PRIMARY KEY,
	url STRING NOT NULL,
	owner_id STRING,
	restricted BOOLEAN NOT NULL,
	created_at TIMESTAMP NOT NULL,
	expires_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS visits (
	shortlink_id STRING NOT NULL,
	browser STRING,
	os STRING,
	cpu STRING,
	engine STRING,
	visited_at TIMESTAMP NOT NULL,
	FOREIGN KEY (shortlink_id) REFERENCES shortlinks(id)
);