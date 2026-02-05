INSERT INTO public.jobs (name, differential_class, differential_amount, has_subjobs) VALUES
('Labour', 'BASE', 0.00, true),
('First Aid', 'BASE', 0.00, true),
('Rubber Tire Gantry', 'CLASS_2', 1.50, false),
('Lift Truck', 'CLASS_3', 0.65, false),
('Head Checker', 'BASE', 0.00, true),
('Dock Checker', 'BASE', 0.00, false),
('Wheat Machine', 'BASE', 0.00, false),
('Loci', 'BASE', 0.00, false),
('Bulk Operator', 'BASE', 0.00, false),
('Liquid Bulk', 'BASE', 0.00, false),
('Wheat Specialty', 'BASE', 0.00, false),
('Welder', 'CLASS_1', 2.50, false),
('Reachstacker', 'CLASS_3', 0.65, false),
('Dock Gantry', 'CLASS_2', 1.50, false),
('Winch Driver', 'CLASS_4', 0.40, false),
('Hatch Tender/Signals', 'CLASS_4', 0.40, false),
('Storesperson', 'BASE', 0.00, false),
('Ship Gantry', 'CLASS_2', 1.50, false),
('Hd Mechanic', 'CLASS_1', 2.50, false),
('Gearperson', 'CLASS_4', 0.40, false),
('Rail Mounted Gantry', 'CLASS_2', 1.50, false),
('Dow Men', 'BASE', 0.00, false),
('Tractor Trailer', 'CLASS_3', 0.65, true),
('Millwright', 'CLASS_1', 2.50, false),
('Front End Loader', 'CLASS_3', 0.65, false),
('Switchman', 'BASE', 0.00, false),
('Trainer', 'BASE', 0.00, false),
('Excavator', 'BASE', 0.00, false),
('Bulldozer', 'BASE', 0.00, false),
('Komatsu', 'BASE', 0.00, false),
('Trackmen', 'BASE', 0.00, false),
('Painter', 'BASE', 0.00, false),
('Carpenter', 'BASE', 0.00, false),
('Electrician', 'CLASS_1', 2.50, false),
('Bunny Bus', 'BASE', 0.00, false),
('Pusher', 'BASE', 0.00, false),
('Lockerman', 'BASE', 0.00, false),
('40 Ton (Top Pick)', 'BASE', 0.00, false),
('Plumber', 'BASE', 0.00, false),
('Training', 'BASE', 0.00, false),
('Lines', 'BASE', 0.00, false),
('Ob', 'BASE', 0.00, false),
('Mobile Crane', 'BASE', 0.00, false);

INSERT INTO public.subjobs (job_id, name)
SELECT j.id, s.name FROM public.jobs j
CROSS JOIN (VALUES ('Rail'), ('Ship'), ('Yard'), ('Barge')) AS s(name)
WHERE j.name = 'Tractor Trailer';

INSERT INTO public.subjobs (job_id, name)
SELECT j.id, s.name FROM public.jobs j
CROSS JOIN (VALUES ('Canopy'), ('Ingate'), ('Outgate'), ('Reefer'), ('Gopher'), ('Rail'), ('Penthouse'), ('Rail Planner'), ('Yard Planner'), ('Rail Planner Gphr'), ('Equip. Control'), ('Tower'), ('Roc')) AS s(name)
WHERE j.name = 'Head Checker';

INSERT INTO public.subjobs (job_id, name)
SELECT j.id, s.name FROM public.jobs j
CROSS JOIN (VALUES (''), ('Janitor'), ('Lashing'), ('Slingman'), ('Shedmen'), ('Utility'), ('Coastwise'), ('Holdmen'), ('Spare')) AS s(name)
WHERE j.name = 'Labour';

INSERT INTO public.subjobs (job_id, name)
SELECT j.id, s.name FROM public.jobs j
CROSS JOIN (VALUES ('Ship'), ('Dock'), ('Stores')) AS s(name)
WHERE j.name = 'First Aid';

INSERT INTO public.locations (name) VALUES
('G3'), ('Alliance Grain'), ('Annacis Auto'), ('Cargill'), ('Cascadia'), ('Centennial'),
('Deltaport'), ('Bc Sugar'), ('Canada Place'), ('Chemtrade'), ('Fibreco'),
('Fraser Surrey'), ('Lynnterm'), ('Neptune'), ('Port Moody'), ('Richardson'),
('Squamish'), ('Univar'), ('Van Wharves'), ('Vanterm'), ('Viterra Pac'),
('Waterfront Train. Cntr'), ('Western Locker'), ('Westshore');

INSERT INTO public.holidays (name, date, qualifying_start, qualifying_end, qualifying_days_required, year) VALUES
('Family Day', '2025-02-17', '2025-02-03', '2025-02-16', 15, 2025),
('Good Friday', '2025-04-18', '2025-04-04', '2025-04-17', 15, 2025),
('Easter Monday', '2025-04-21', '2025-04-07', '2025-04-20', 15, 2025),
('Victoria Day', '2025-05-19', '2025-05-05', '2025-05-18', 15, 2025),
('Canada Day', '2025-07-01', '2025-06-17', '2025-06-30', 15, 2025),
('BC Day', '2025-08-04', '2025-07-21', '2025-08-03', 15, 2025),
('Labour Day', '2025-09-01', '2025-08-18', '2025-08-31', 15, 2025),
('National Day For Truth & Reconciliation', '2025-09-30', '2025-09-16', '2025-09-29', 15, 2025),
('Thanksgiving', '2025-10-13', '2025-09-29', '2025-10-12', 15, 2025),
('Remembrance Day', '2025-11-11', '2025-10-28', '2025-11-10', 15, 2025),
('Christmas', '2025-12-25', '2025-12-11', '2025-12-24', 15, 2025),
('Boxing Day', '2025-12-26', '2025-12-12', '2025-12-25', 15, 2025),
('New Years', '2026-01-01', '2025-12-18', '2025-12-31', 15, 2026),
('Family Day', '2026-02-15', '2026-02-01', '2026-02-14', 15, 2026),
('Good Friday', '2026-04-03', '2026-03-20', '2026-04-02', 15, 2026),
('Easter Monday', '2026-04-06', '2026-03-23', '2026-04-05', 15, 2026),
('Victoria Day', '2026-05-18', '2026-05-04', '2026-05-17', 15, 2026),
('Canada Day', '2026-07-01', '2026-06-17', '2026-06-30', 15, 2026),
('BC Day', '2026-08-03', '2026-07-20', '2026-08-02', 15, 2026),
('Labour Day', '2026-09-07', '2026-08-24', '2026-09-06', 15, 2026),
('National Day For Truth & Reconciliation', '2026-09-30', '2026-09-16', '2026-09-29', 15, 2026),
('Thanksgiving', '2026-10-12', '2026-09-28', '2026-10-11', 15, 2026),
('Remembrance Day', '2026-11-11', '2026-10-28', '2026-11-10', 15, 2026),
('Christmas', '2026-12-25', '2026-12-11', '2026-12-24', 15, 2026),
('Boxing Day', '2026-12-28', '2026-12-14', '2026-12-27', 15, 2026),
('New Years', '2027-01-01', '2026-12-18', '2026-12-31', 15, 2027);

INSERT INTO public.posts (title, content) VALUES
('PortPal Beta is LIVE!', 'Welcome to PortPal! We''re excited to launch our beta version. Track your shifts, earnings, and more all in one place.'),
('Better Selection Features Are Here!', 'We''ve improved the job and location selection to make logging your shifts even faster.'),
('The New PortPal is Live!', 'We''ve completely rebuilt PortPal from the ground up with a modern, faster experience.');
