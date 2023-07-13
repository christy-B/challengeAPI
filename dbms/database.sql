CREATE DATABASE IF NOT EXISTS challenge;

/* Créer l'utilisateur API */
CREATE USER IF NOT EXISTS 'api-dev'@'%.%.%.%' IDENTIFIED BY 'api-dev-password';
GRANT SELECT, UPDATE, INSERT, DELETE ON challenge.* TO 'api-dev'@'%.%.%.%';
FLUSH PRIVILEGES;


/* La définition du schéma */
USE challenge;
-- Création de la table PROMO
CREATE TABLE PROMO (
    id_promo int auto_increment not null,
    mon_promo unique VARCHAR(256) NOT NULL,
    primary key(id_promo)
);
-- Création de la table USER
CREATE TABLE USER (
    id_user int auto_increment not null,
    nom_user VARCHAR(256) NOT NULL,
    prenom_user VARCHAR(256) NOT NULL,
    email_user VARCHAR(256) unique not null,
    scope ENUM('user', 'admin') NOT NULL,
    id_promo INT,
    FOREIGN KEY (id_promo) REFERENCES PROMO(id_promo),
    primary key(id_user)
);
CREATE TABLE CHALLENGE (
    id_challenge int auto_increment not null,
    nom_challenge VARCHAR(256) NOT NULL,
    primary key(id_challenge)
);
-- Création de la table CHALLENGE
CREATE TABLE SESSION (
    id_session int auto_increment not null,
    nom_session VARCHAR(256) NOT NULL,
    debut_session TIMESTAMP DEFAULT NOW(),
    fin_session TIMESTAMP DEFAULT NULL,
    id_promo INT NOT NULL,
    id_challenge INT DEFAULT 1 NOT NULL,
    FOREIGN KEY (id_promo) REFERENCES PROMO(id_promo),
    FOREIGN KEY (id_challenge) REFERENCES CHALLENGE(id_challenge),
    session_active BOOLEAN DEFAULT 1,
    primary key(id_session)
);

-- Création de la table QUESTION
CREATE TABLE QUESTION (
    id_question int auto_increment not null,
    question_text VARCHAR(256) NOT NULL,
    question_description VARCHAR(200) NOT NULL,
    bonne_reponse VARCHAR(256) NOT NULL,
    question_score INT NOT NULL,
    id_challenge INT,
    FOREIGN KEY (id_challenge) REFERENCES CHALLENGE(id_challenge),
    primary key(id_question)
);
-- Création de la table SCORE
CREATE TABLE SCORE (
    id_score int auto_increment not null,
    score INT NOT NULL,
    user_foreign_key INT,
    session_foreign_key INT,
    FOREIGN KEY (user_foreign_key) REFERENCES USER(id_user),
    FOREIGN KEY (session_foreign_key) REFERENCES SESSION(id_session),
    primary key(id_score)
);
-- Creation de la table instance 
CREATE TABLE INSTANCE (
id_instance int auto_increment not null,
ip_instance VARCHAR(15),
port_instance SMALLINT UNSIGNED,
user_instance VARCHAR(32),
user_foreign_key INT NOT NULL, 
password_instance VARCHAR(200), 
FOREIGN KEY (user_foreign_key) REFERENCES USER(id_user),
primary key(id_instance)
);
drop trigger if exists before_insert_user;
create trigger before_insert_user
before insert
on USER for each row set new.email_user = lower(trim(new.email_user));



DELIMITER $$

/* Vérification de la longueur du mot de passe */
CREATE TRIGGER check_password_length BEFORE INSERT ON INSTANCE
FOR EACH ROW
BEGIN
    IF LENGTH(NEW.password_instance) < 8 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Password must be at least 8 characters long';
    END IF;
END$$

/* Vérification de la longueur de l'adresse IP */
CREATE TRIGGER check_ip_length BEFORE INSERT ON INSTANCE
FOR EACH ROW
BEGIN
    IF LENGTH(NEW.ip_instance) < 7 OR LENGTH(NEW.ip_instance) > 15 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'IP address must be between 7 and 15 characters long';
    END IF;
END$$

DELIMITER ;


DELIMITER //

CREATE TRIGGER before_insert_score
BEFORE INSERT ON SCORE
FOR EACH ROW
BEGIN
    DECLARE score_count INT;
    
    SELECT COUNT(*) INTO score_count
    FROM SCORE
    WHERE user_foreign_key = NEW.user_foreign_key
    AND session_foreign_key = NEW.session_foreign_key;
    
    IF score_count > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Score for this user and session already created. Duplicate score for user and session.';
    END IF;
END //

DELIMITER ;
