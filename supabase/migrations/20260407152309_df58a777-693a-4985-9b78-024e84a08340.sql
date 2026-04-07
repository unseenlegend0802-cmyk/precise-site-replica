
-- Add patient_stage column to profiles table to track treatment journey
ALTER TABLE public.profiles 
ADD COLUMN patient_stage text NOT NULL DEFAULT 'new';

-- Add a comment for documentation
COMMENT ON COLUMN public.profiles.patient_stage IS 'Treatment journey stage: new, report_uploaded, doctor_selected, op_booked, op_completed, procedure_recommended, ip_booked, ip_completed, followup_due, completed';
