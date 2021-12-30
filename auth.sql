DROP TABLE user;
CREATE TABLE user (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	username TEXT NOT NULL UNIQUE,
	passcode TEXT NOT NULL
);

INSERT INTO user (username,passcode) VALUES ('gene','abc123');
INSERT INTO user (username,passcode) VALUES ('fred','flintstone');