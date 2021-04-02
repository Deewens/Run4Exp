/* Admin */
INSERT INTO user VALUES (1, null, 'ilya@gmail.com', 'Ukhanov', 'Ilya', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (1, 1);
INSERT INTO user_roles VALUES (1, 0);

/* Simple user */
INSERT INTO user VALUES (2, null, 'ilya2@gmail.com', 'Ukhanov2', 'Ilya2', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (2, 1);

/* Challenge no image - Admin */
INSERT INTO challenge VALUES (1, null, 'AAADescription', 'Challenge1', 10.5);
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (1, 1);

/* Challenge no image - User */
INSERT INTO challenge VALUES (2, null, 'BBBDescription', 'Challenge2', 12.0);
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (2, 2);

/* Challenge no image - Admin */
/* FILE_READ: fonction Hibernate - transforme un fichier en HEX. */
/* "classpath:" permets de lire sur le classpath dans target/test-classes. 
Spring inserre automatiquement le contenu de test/ressources dans le classpath */
INSERT INTO challenge VALUES (3, FILE_READ('classpath:muskWeed.jpg'), 'CCCDescription', 'Challenge3', 12.0);
INSERT INTO challenge_administrators(administrator_id, challenge_id) VALUES (1, 3);