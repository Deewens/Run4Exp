/* Admin */
INSERT INTO user VALUES (1, null, 'ilya@gmail.com', 'Ukhanov', 'Ilya', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (1, 1);
INSERT INTO user_roles VALUES (1, 0);

/* Simple user */
INSERT INTO user VALUES (2, null, 'ilya2@gmail.com', 'Ukhanov2', 'Ilya2', '$2a$12$CoF9BPzKH2wUEYUGlDyvK.T.jT.nIV52Mf/tGoXjv0WWDXP.IsIrS');
INSERT INTO user_roles VALUES (2, 1);

INSERT INTO challenge VALUES (1, null, 'AAADescription', 'Challenge1', 10.5);
INSERT INTO challenge_administrators VALUES (1, 1);

INSERT INTO challenge VALUES (2, null, 'BBBDescription', 'Challenge2', 12.0);
INSERT INTO challenge_administrators VALUES (1, 2);