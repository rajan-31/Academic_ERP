INSERT INTO domain VALUES
(1, "M. Tech. CSE", "MT", 2024, 150, "GATE CSE"),
(2, "M. Tech. ECE", "MT", 2024, 40, "GATE ECE"),
(3, "I. M. Tech. CSE", "IMT", 2024, 60, "JEE ADV"),
(4, "I. M. Tech. ECE", "IMT", 2024, 40, "JEE ADV"),
(5, "M. S. CSE", "MS", 2024, 15, "GATE CSE"),
(6, "M. S. ECE", "MS", 2024, 10, "GATE ECE");

INSERT INTO specialization VALUES
(1, "AIM", "Artificial Intelligence and Machine Learning", "", 2024, 70),
(2, "TCS", "Theoretical Computer Science", "", 2024, 60),
(3, "SSY", "Software Systems", "", 2024, 60),
(4, "NC", "Networking and Communication", "", 2024, 40),
(5, "VLSI", "VLSI Systems", "", 2024, 60),
(6, "DT", "Digital Society", "", 2024, 50);

INSERT INTO placement VALUES
(1, "Oracle", "SDE 1", "Backend Development", 5, 3.2),
(2, "Cerebras", "Data Scientist", "LORA LLM Research", 2, 3.4),
(3, "Media.net", "SDE 1", "Full-stack Development", 4, 3.0),
(4, "Ring Central", "SDE 1", "Backend Development", 3, 3.2),
(5, "Google", "ML Engineer", "Machine Learning Research", 2, 3.2),
(6, "Cisco", "VLSI Design Engineer", "VLSI Design", 3, 3.0),
(7, "Qualcomm", "Systems Software Engineer", "Systems Software Development", 5, 3.3);

INSERT INTO student (student_id, roll_number, first_name, last_name, email, photograph_path, cgpa, graduation_year, total_credits, domain, specialization, placement) VALUES
(1, 'MT2024001', 'John', 'Cena', 'cena.john546@iiitb.ac.in', '/uploads/images/MT2024001.png', 3.99, 2024, 120, 1, 1, 1),
(2, 'MT2024002', 'Dwayne', 'Johnson', 'johnson.dwayne489@iiitb.ac.in', '/uploads/images/MT2024002.png', 3.85, 2024, 130, 1, 2, 3),
(3, 'MT2024003', 'Brock', 'Lesnar', 'lesnar.brock731@iiitb.ac.in', '/uploads/images/MT2024003.png', 3.9, 2024, 110, 1, 3, 4),
(4, 'IMT2024001', 'Virat', 'Kohli', 'kohli.virat372@iiitb.ac.in', '/uploads/images/IMT2024001.png', 3.8, 2024, 120, 3, 1, NULL),
(5, 'IMT2024002', 'Rohit', 'sharma', 'sharma.rohit482@iiitb.ac.in', '/uploads/images/IMT2024002.png', 3.6, 2024, 100, 3, 2, NULL),
(6, 'MT2024004', 'Dave', 'Bautista', 'bautista.dave591@iiitb.ac.in', '/uploads/images/MT2024004.png', 3.92, 2024, 140, 1, 3, 6),
(7, 'MT2024005', 'Randy', 'Orton', 'orton.randy152@iiitb.ac.in', '/uploads/images/MT2024005.png', 3.88, 2024, 110, 1, 1, 7),
(8, 'IMT2024003', 'MS', 'Dhoni', 'dhoni.ms@iiitb.ac.in', '/uploads/images/IMT2024003.png', 3.75, 2024, 120, 3, 2, NULL),
(9, 'MT2024006', 'Henry', 'Cavill', 'cavill.henry293@iiitb.ac.in', '/uploads/images/MT2024006.png', 3.95, 2024, 115, 1, 1, 5),
(10, 'IMT2024004', 'Pedro', 'Pascal', 'pascal.pedro647@iiitb.ac.in', '/uploads/images/IMT2024004.png', 3.72, 2024, 105, 3, 3, NULL);

INSERT INTO user_credentials (id, email, password_encoded, user_type) VALUES
(1, "cavill.henry@iiitb.ac.in", "$argon2id$v=19$m=16384,t=4,p=1$i7hXX2lGDztNlJ/2JdEYcA$oJ+MTNStvQcnTZxk+qyYn82fjV5agdAEduC/30/gea0", "employee")
