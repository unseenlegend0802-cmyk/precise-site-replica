
-- Add procedures for doctors that don't have them yet
INSERT INTO doctor_procedures (doctor_id, procedure_name, procedure_slug, procedure_count, success_rate) VALUES
-- Dr. Nikhil Sunkarineni (Neurology & IR)
('57d24c69-0304-4dc4-b3dd-5c5bb47a4e0b', 'Varicose Vein Laser Treatment', 'varicose-vein-treatment', 300, 96),
('57d24c69-0304-4dc4-b3dd-5c5bb47a4e0b', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 150, 94),
('57d24c69-0304-4dc4-b3dd-5c5bb47a4e0b', 'DVT Thrombolysis', null, 100, 93),

-- Dr. Nishant Sunkarineni (Interventional Cardiology)
('88fd1136-f97b-4f75-82d1-b178eaa07340', 'Coronary Angioplasty', null, 500, 97),
('88fd1136-f97b-4f75-82d1-b178eaa07340', 'Peripheral Angioplasty', null, 200, 95),
('88fd1136-f97b-4f75-82d1-b178eaa07340', 'TAVR', 'tavr', 80, 94),

-- Dr. Sibasankar Dalai (Neuro Vascular)
('9f8f1c2b-dac3-4477-ab65-d9343219909c', 'Cerebral Aneurysm Coiling', null, 250, 95),
('9f8f1c2b-dac3-4477-ab65-d9343219909c', 'Stroke Thrombectomy', null, 300, 93),
('9f8f1c2b-dac3-4477-ab65-d9343219909c', 'Carotid Stenting', null, 120, 96),

-- Dr. Bhavyasree
('aa737023-9d63-4644-8b7e-872e1b2498ce', 'Varicose Vein Embolization', 'varicose-vein-treatment', 200, 95),
('aa737023-9d63-4644-8b7e-872e1b2498ce', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 120, 94),
('aa737023-9d63-4644-8b7e-872e1b2498ce', 'Image-Guided Biopsy', null, 150, 97),

-- Dr. Ankit
('c50c2209-3744-42a5-b59b-7fd3c86d203f', 'Varicose Vein Treatment', 'varicose-vein-treatment', 180, 95),
('c50c2209-3744-42a5-b59b-7fd3c86d203f', 'Varicocele Embolization', 'varicocele-embolization', 100, 94),
('c50c2209-3744-42a5-b59b-7fd3c86d203f', 'Peripheral Angioplasty', null, 80, 93),

-- Dr. Mandeep Sagar
('2185dd18-e7e1-4684-9094-89b70a6adcda', 'Varicose Vein Embolization', 'varicose-vein-treatment', 250, 96),
('2185dd18-e7e1-4684-9094-89b70a6adcda', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 130, 95),
('2185dd18-e7e1-4684-9094-89b70a6adcda', 'Abscess Drainage', null, 100, 97),

-- Dr. Deepashree
('e230095a-ae77-4a3e-a7f3-b6f2c2d0e313', 'Biliary Drainage', null, 150, 95),
('e230095a-ae77-4a3e-a7f3-b6f2c2d0e313', 'Varicose Vein Treatment', 'varicose-vein-treatment', 120, 94),
('e230095a-ae77-4a3e-a7f3-b6f2c2d0e313', 'Image-Guided Biopsy', null, 180, 96),

-- Dr. Periyalaruppan
('d756ecb1-ff14-4ee8-b4d7-e545deca8a82', 'Varicose Vein Embolization', 'varicose-vein-treatment', 350, 97),
('d756ecb1-ff14-4ee8-b4d7-e545deca8a82', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 200, 95),
('d756ecb1-ff14-4ee8-b4d7-e545deca8a82', 'Varicocele Embolization', 'varicocele-embolization', 150, 96),

-- Dr. Arul
('52554941-2c19-4f6f-be7d-309b968244e9', 'Varicose Vein Treatment', 'varicose-vein-treatment', 220, 95),
('52554941-2c19-4f6f-be7d-309b968244e9', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 140, 94),
('52554941-2c19-4f6f-be7d-309b968244e9', 'Peripheral Angioplasty', null, 100, 93),

-- Dr. Muthurajan
('38e78c17-c300-4e85-a5e1-912930b53b84', 'Varicose Vein Embolization', 'varicose-vein-treatment', 300, 96),
('38e78c17-c300-4e85-a5e1-912930b53b84', 'Varicocele Embolization', 'varicocele-embolization', 180, 95),
('38e78c17-c300-4e85-a5e1-912930b53b84', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 160, 95),
('38e78c17-c300-4e85-a5e1-912930b53b84', 'Prostate Artery Embolization', 'prostate-artery-embolization', 80, 94),

-- Dr. Raj Soni
('3d1b588b-3864-443e-8510-66d0602bf041', 'Varicose Vein Treatment', 'varicose-vein-treatment', 250, 96),
('3d1b588b-3864-443e-8510-66d0602bf041', 'Varicocele Embolization', 'varicocele-embolization', 120, 95),
('3d1b588b-3864-443e-8510-66d0602bf041', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 100, 94),

-- Dr. Partha Pratim
('b73afa5c-dbff-4fe9-a3a5-7d20b9b660ed', 'Varicose Vein Embolization', 'varicose-vein-treatment', 300, 96),
('b73afa5c-dbff-4fe9-a3a5-7d20b9b660ed', 'Liver TACE', null, 200, 94),
('b73afa5c-dbff-4fe9-a3a5-7d20b9b660ed', 'Peripheral Angioplasty', null, 180, 95),
('b73afa5c-dbff-4fe9-a3a5-7d20b9b660ed', 'Tumor Ablation', null, 120, 93),

-- Dr. Praveen Keshav
('3bddf643-4232-4b4f-aad0-755d9ceb5e9e', 'Varicose Vein Embolization', 'varicose-vein-treatment', 200, 95),
('3bddf643-4232-4b4f-aad0-755d9ceb5e9e', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 130, 94),
('3bddf643-4232-4b4f-aad0-755d9ceb5e9e', 'Varicocele Embolization', 'varicocele-embolization', 100, 95),

-- Dr. Manish Kumar Yadav
('61cdbee5-0ff1-433e-a9b7-ffb80add7042', 'Varicose Vein Treatment', 'varicose-vein-treatment', 220, 95),
('61cdbee5-0ff1-433e-a9b7-ffb80add7042', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 110, 94),
('61cdbee5-0ff1-433e-a9b7-ffb80add7042', 'Image-Guided Drainage', null, 90, 96),

-- Dr. Jithu Subash Babu
('d5e2095a-dae3-4926-97c2-2f29af4cfad8', 'Varicose Vein Treatment', 'varicose-vein-treatment', 150, 94),
('d5e2095a-dae3-4926-97c2-2f29af4cfad8', 'Varicocele Embolization', 'varicocele-embolization', 80, 93),
('d5e2095a-dae3-4926-97c2-2f29af4cfad8', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 70, 94),

-- Dr. Thoufiq Ali
('69631fa1-8cef-4d9a-abf7-01eed44fb3e4', 'Varicose Vein Treatment', 'varicose-vein-treatment', 160, 94),
('69631fa1-8cef-4d9a-abf7-01eed44fb3e4', 'Varicocele Embolization', 'varicocele-embolization', 90, 93),

-- Dr. T. Seetam Kumar
('8a4a6439-b01a-4114-9e32-62eb26245f61', 'Varicose Vein Treatment', 'varicose-vein-treatment', 200, 95),
('8a4a6439-b01a-4114-9e32-62eb26245f61', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 120, 94),
('8a4a6439-b01a-4114-9e32-62eb26245f61', 'Tumor Ablation', null, 80, 93),

-- Dr. Vineel Inampudi
('0f628801-5c4d-4f04-903c-7cfccbf9249b', 'Varicose Vein Embolization', 'varicose-vein-treatment', 350, 96),
('0f628801-5c4d-4f04-903c-7cfccbf9249b', 'Varicocele Embolization', 'varicocele-embolization', 200, 95),
('0f628801-5c4d-4f04-903c-7cfccbf9249b', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 180, 95),
('0f628801-5c4d-4f04-903c-7cfccbf9249b', 'Peripheral Angioplasty', null, 150, 94),

-- Dr. Zade
('3e2e2f6d-c704-44f3-a8b1-ee71ab6d24df', 'Varicose Vein Treatment', 'varicose-vein-treatment', 280, 96),
('3e2e2f6d-c704-44f3-a8b1-ee71ab6d24df', 'Uterine Fibroid Embolization', 'uterine-fibroid-embolization', 150, 94),
('3e2e2f6d-c704-44f3-a8b1-ee71ab6d24df', 'Varicocele Embolization', 'varicocele-embolization', 130, 95),
('3e2e2f6d-c704-44f3-a8b1-ee71ab6d24df', 'Prostate Artery Embolization', 'prostate-artery-embolization', 70, 93);
