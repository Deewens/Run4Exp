/* Admin */
INSERT INTO user VALUES (1, null, 'ilya@gmail.com', 'Ukhanov', 'Ilya', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (1, 1);
INSERT INTO user_roles VALUES (1, 0);

/* Simple user */
INSERT INTO user VALUES (2, null, 'ilya2@gmail.com', 'Ukhanov2', 'Ilya2', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (2, 1);

/* Challenge no image - Admin */
INSERT INTO challenge VALUES (1, null, 'AAADescription', 'Challenge1', 10.5, 'Shiort');
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (1, 1);

/* Challenge no image - User */
INSERT INTO challenge VALUES (2, null, 'BBBDescription', 'Challenge2', 12.0, 'Shiort');
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (2, 2);

/* Challenge image - Admin */
/* FILE_READ: fonction Hibernate - transforme un fichier en HEX. */
/* "classpath:" permets de lire sur le classpath dans target/test-classes. 
Spring inserre automatiquement le contenu de test/ressources dans le classpath */
INSERT INTO challenge VALUES (3, FILE_READ('classpath:muskWeed.jpg'), 'CCCDescription', 'Challenge3', 12.0, 'Shiort');
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (1, 3); 

/********************************************************
/**************** USER_SESSION **************************
********************************************************/

/* Challenge for UserSession - no image - User */
/* FILE_READ: fonction Hibernate - transforme un fichier en HEX. */
/* "classpath:" permets de lire sur le classpath dans target/test-classes. */
/*INSERT INTO challenge VALUES (4, null, 'UserSession Challenge Description', 'Challenge4UserSession', 12.0, 'Challenge4UserSession Shiort');
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (1, 4);

INSERT INTO coordinate VALUES(1, 100, 100);
INSERT INTO checkpoint VALUES(1, "MIDDLE", "Checkpoint1", 4, 1);

INSERT INTO coordinate VALUES(2, 100, 100);
INSERT INTO checkpoint VALUES(2, "MIDDLE", "Checkpoint2", 4, 2);

INSERT INTO coordinate VALUES(3, 100, 100);
INSERT INTO checkpoint VALUES(3, "MIDDLE", "Checkpoint3", 4, 3);

INSERT INTO segment VALUES(1, "Segment1", 4, 2, 1);
INSERT INTO segment VALUES(2, "Segment2", 4, 3, 2);

INSERT INTO user_session VALUES(1, 4, 2);*/