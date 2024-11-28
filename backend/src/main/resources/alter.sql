ALTER TABLE student
ADD CONSTRAINT FK_Student_Domain FOREIGN KEY (domain) REFERENCES domain(domain_id);

ALTER TABLE student
ADD CONSTRAINT FK_Student_Specialization FOREIGN KEY (specialization) REFERENCES specialization(specialization_id);

ALTER TABLE student
ADD CONSTRAINT FK_Student_Placement FOREIGN KEY (placement) REFERENCES placement(id);
