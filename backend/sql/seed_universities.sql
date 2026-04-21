-- Seed catalog (run once after schema.sql).
-- Costs are stored in INR per year.

insert into public.universities
  (name, program, country, city, "degreeLevel", "fieldOfStudy", "minCgpa", "maxBacklogs",
   "ieltsRequired", "greRequired", "tuitionPerYear", "livingCostPerYear", "totalCostPerYear",
   "prTimelineMonths", ranking, "applicationDeadline", "intakeTerms", notes)
values
-- ===== Germany (public, near-zero tuition) =====
('TU Munich', 'MSc Informatics', 'Germany', 'Munich', 'Masters', 'Computer Science',
  8.0, 2, 6.5, null, 0, 1100000, 1100000, 36, 37, 'May 31', 'Fall', 'Tier-1 public; Werkstudent friendly'),
('RWTH Aachen', 'MSc Computer Science', 'Germany', 'Aachen', 'Masters', 'Computer Science',
  7.5, 3, 6.5, null, 0, 950000, 950000, 36, 99, 'Mar 1', 'Fall', 'Strong industry pipeline'),
('TU Berlin', 'MSc Computer Engineering', 'Germany', 'Berlin', 'Masters', 'Systems Engineering',
  7.0, 4, 6.5, null, 0, 1000000, 1000000, 36, 158, 'Apr 30', 'Fall, Spring', 'Defense + embedded ecosystem'),
('TU Darmstadt', 'MSc Embedded Systems', 'Germany', 'Darmstadt', 'Masters', 'Embedded Systems',
  7.5, 3, 6.5, null, 0, 950000, 950000, 36, 269, 'May 15', 'Fall', 'Embedded + autonomy hub'),
('University of Stuttgart', 'MSc INFOTECH', 'Germany', 'Stuttgart', 'Masters', 'Systems Engineering',
  7.5, 3, 6.5, null, 0, 1000000, 1000000, 36, 296, 'Mar 15', 'Fall', 'Mercedes / Bosch corridor'),

-- ===== Canada =====
('University of Waterloo', 'MEng Electrical & Computer', 'Canada', 'Waterloo', 'Masters', 'Computer Science',
  8.0, 2, 7.0, null, 1800000, 1200000, 3000000, 24, 112, 'Feb 1', 'Fall, Spring', 'Co-op + PR fast track'),
('University of Toronto', 'MScAC Computer Science', 'Canada', 'Toronto', 'Masters', 'Computer Science',
  8.5, 1, 7.0, 320, 2400000, 1500000, 3900000, 24, 21, 'Dec 1', 'Fall', 'Top tier; competitive'),
('University of British Columbia', 'MEng Computer Engineering', 'Canada', 'Vancouver', 'Masters', 'Computer Science',
  8.0, 2, 6.5, null, 2000000, 1400000, 3400000, 24, 34, 'Jan 15', 'Fall', 'PR-friendly province'),

-- ===== USA =====
('Carnegie Mellon University', 'MS Computer Science', 'USA', 'Pittsburgh', 'Masters', 'Computer Science',
  9.0, 0, 7.5, 330, 5500000, 2000000, 7500000, 60, 4, 'Dec 15', 'Fall', 'Reach; elite CS'),
('Georgia Tech', 'MS Computer Science', 'USA', 'Atlanta', 'Masters', 'Computer Science',
  8.5, 1, 7.0, 320, 4200000, 1600000, 5800000, 60, 38, 'Feb 1', 'Fall, Spring', 'Strong systems + HPC'),
('University of Texas Austin', 'MS Computer Science', 'USA', 'Austin', 'Masters', 'Computer Science',
  8.5, 1, 7.0, 320, 4000000, 1500000, 5500000, 60, 30, 'Dec 15', 'Fall', 'Tech + defense corridor'),
('Arizona State University', 'MS Computer Science', 'USA', 'Tempe', 'Masters', 'Computer Science',
  7.0, 4, 6.5, 300, 2800000, 1100000, 3900000, 60, 215, 'Apr 1', 'Fall, Spring', 'Accessible US route'),

-- ===== UK =====
('University of Edinburgh', 'MSc Artificial Intelligence', 'UK', 'Edinburgh', 'Masters', 'AI/ML Engineering',
  8.0, 2, 7.0, null, 3500000, 1300000, 4800000, 60, 22, 'Mar 31', 'Fall', '1-year Masters; AI hub'),
('Imperial College London', 'MSc Computing', 'UK', 'London', 'Masters', 'Computer Science',
  8.5, 1, 7.0, null, 4500000, 1800000, 6300000, 60, 8, 'Mar 31', 'Fall', 'Top ranked; competitive'),

-- ===== Australia =====
('University of Melbourne', 'MS Computer Science', 'Australia', 'Melbourne', 'Masters', 'Computer Science',
  8.0, 2, 6.5, null, 3200000, 1500000, 4700000, 36, 14, 'Oct 31', 'Fall, Spring', 'PR-aligned skill list'),

-- ===== Netherlands =====
('TU Delft', 'MSc Computer Science', 'Netherlands', 'Delft', 'Masters', 'Computer Science',
  7.5, 3, 6.5, null, 1800000, 1100000, 2900000, 60, 47, 'Apr 1', 'Fall', 'High-end research; English'),

-- ===== Singapore =====
('NUS Singapore', 'MComp Computer Science', 'Singapore', 'Singapore', 'Masters', 'Computer Science',
  8.0, 2, 6.5, 320, 3000000, 1500000, 4500000, 60, 8, 'Mar 15', 'Fall', 'Asia hub; strong placements')
on conflict do nothing;
