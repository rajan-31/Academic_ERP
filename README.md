# Academic ERP

## 1.1 Student Admission
Ask for student details including photograph(do not save as blob), and the domain(Drop Down
Selection) like iM.Tech CSE, M.Tech ECE etc. On the basis of the above selection assign unique roll number based on pattern like (IMT20xxxxx, MS20xxxxx).

## 1.2 Student Details Modify
Modify all details of the student including roll number, photograph(do not save as blob) and
domain (Drop Down Selection), accordingly update all referenced tables.

## Features
- Logging
- Unique roll number based on domain
- Unique, simple email
- JWT Auth

## To Do
- Secure routes

## Production: To Do
- Change generateSecurePassword() methods default password, and change password length
- Change min, max password length in UserCredentials entity

---

### Instructions

1. As part of the course, students have to implement a mini-project involving all elements
   of full-stack software development.
2. The weight for this component of the course grade is 35% of ESD grade component
3. The mini-project can be done in a group containing no more than 2 members
4. Full database schema covering the entire ERP will be given to you
5. For the assigned use case, all elements of “full-stack” needs to be implemented using a
   subset of the database schema as needed
6. There is NO NEED to integrate with the use cases of OTHER groups
7. You need to manually populate the pre-requisite data for your specific use case with
   INSERT statements wherever required (e.g., for course registration details, the master
   data of students and courses need to be manually populated)
8. You can make your own (reasonable!) assumptions regarding the functional
   requirements associated with your use case. The user interface and business logic needs
   to be implemented accordingly.

### Grading

1. Grading will be done on the basis of individual (not group!) demo / viva voce of your use
   case.
2. Thorough knowledge of the solution implemented is expected
3. One specific change in the use case will be asked. You need to be able to articulate (i.e.,
   explain) how exactly that change will be implemented

---

```mysql
CREATE TABLE domain (
    domain_id INT PRIMARY KEY,
    program VARCHAR(50),
    code VARCHAR(20) NOT NULL,
    batch INT,
    capacity INT,
    qualification VARCHAR(50)
);

CREATE TABLE specialization (
    specialization_id INT PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(50),
    description TEXT,
    year INT,
    credits_required INT
);

CREATE TABLE placement (
    id BIGINT PRIMARY KEY,
    organisation VARCHAR(100),
    profile VARCHAR(100),
    description TEXT,
    intake INT,
    minimum_grade FLOAT
);

CREATE TABLE Student (
    student_id BIGINT PRIMARY KEY,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    photograph_path VARCHAR(255),
    cgpa FLOAT,
    total_credits INT,
    graduation_year INT,
    domain INT,
    specialization INT,
    placement BIGINT,
    FOREIGN KEY (domain) REFERENCES Domain(domain_id),
    FOREIGN KEY (specialization) REFERENCES Specialization(specialization_id),
    FOREIGN KEY (placement) REFERENCES Placement(id)
);
```

```mysql
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

SELECT * FROM domain;
SELECT * FROM specialization;
SELECT * FROM placement;
```