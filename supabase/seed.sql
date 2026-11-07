-- ==============================================================================
-- EV CYBER ACADEMY – PRODUCTION SEED DATA FOR SUPABASE
-- Seed: supabase/seed.sql
-- ==============================================================================

-- 1. COURSES SEED
INSERT INTO public.courses (
    id, slug, title, tagline, summary, description,
    level, duration_weeks, hours_per_week, fee_amount, currency,
    status, featured, badge_text, certification_title,
    batch_start_date, seats_remaining, syllabus, outcomes, prerequisites, tools_covered
) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'certified-soc-analyst-l1-l2',
    'Certified SOC Analyst & Threat Hunter (L1/L2)',
    'Master Live Security Operations, SIEM Architecture, Incident Triage & Threat Hunting',
    'An intensive, production-oriented program engineered to prepare you for high-velocity Blue Team operations in modern Security Operations Centers.',
    'Equip yourself with enterprise-grade defensive security expertise. From parsing complex log streams in Splunk and Elastic to handling live ransomware containment drills and executing MITRE ATT&CK mapped threat hunts, this program takes you from theoretical fundamentals to high-confidence SOC leadership.',
    'Intermediate',
    12,
    10,
    49999.00,
    'INR',
    'published',
    TRUE,
    'MOST POPULAR',
    'EV Certified Enterprise SOC Analyst (ECSA)',
    CURRENT_DATE + INTERVAL '14 days',
    8,
    '[
        {"module": 1, "title": "Network Traffic Analysis & Packet Inspection", "duration": "2 Weeks", "topics": ["TCP/IP stack deep dive", "Wireshark packet dissections", "Detecting covert C2 channels", "Snort & Zeek protocol analysis"]},
        {"module": 2, "title": "Enterprise SIEM Engineering & Rule Writing", "duration": "3 Weeks", "topics": ["Splunk SPL mastery & Elastic Search syntax", "Correlation rule engineering", "Sigma rule development", "Log source onboarding & tuning"]},
        {"module": 3, "title": "Endpoint Detection & Response (EDR) Mastery", "duration": "3 Weeks", "topics": ["Sysmon telemetry & deep process monitoring", "CrowdStrike & Defender for Endpoint workflows", "Memory forensics with Volatility", "Live malware triage"]},
        {"module": 4, "title": "Threat Intelligence & Proactive Threat Hunting", "duration": "2 Weeks", "topics": ["MITRE ATT&CK framework mapping", "YARA rule crafting", "OSINT threat adversary tracking", "Developing hypothesis-driven hunts"]},
        {"module": 5, "title": "Incident Response Drills & Crisis Management", "duration": "2 Weeks", "topics": ["NIST & SANS incident handling lifecycle", "Ransomware live containment simulation", "Evidence chain of custody", "Post-incident reporting & stakeholder briefing"]}
    ]'::jsonb,
    '[
        "Operate enterprise SIEM platforms (Splunk & Elastic) with advanced query fluency",
        "Investigate active adversary intrusions and isolate compromised host assets within minutes",
        "Perform deep packet inspection to pinpoint data exfiltration and reverse shell channels",
        "Author custom Sigma and YARA rules to detect novel zero-day threats",
        "Produce executive-level incident response reports compliant with global regulatory standards"
    ]'::jsonb,
    '[
        "Basic understanding of computer networking (TCP/IP, DNS, HTTP)",
        "Familiarity with Windows and Linux command line fundamentals",
        "Keen interest in defensive cybersecurity operations"
    ]'::jsonb,
    '["Splunk", "Elasticsearch", "Wireshark", "Sysmon", "Zeek", "Volatility", "CrowdStrike Falcon", "TheHive", "MISP", "Sigma"]'::jsonb
),
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'advanced-offensive-penetration-testing',
    'Advanced Offensive Security & Red Team Operations',
    'Learn Real-world Adversary Emulation, Active Directory Exploitation & Evasion',
    'Go beyond automated scanners. Learn how elite ethical hackers and red teamers penetrate fortified corporate perimeters and compromise Active Directory forests.',
    'A rigorously practical offensive security course designed for professionals targeting offensive certifications like OSCP, CRTP, and PNPT. You will build weaponized exploits, bypass modern EDR defenses, hijack Active Directory Kerberos tickets, and execute multi-stage enterprise attack chains.',
    'Advanced',
    16,
    12,
    64999.00,
    'INR',
    'published',
    TRUE,
    'HARDCORE OFFENSIVE',
    'EV Certified Red Team Specialist (ECRTS)',
    CURRENT_DATE + INTERVAL '21 days',
    6,
    '[
        {"module": 1, "title": "Adversary Reconnaissance & Weaponization", "duration": "2 Weeks", "topics": ["External footprinting & cloud credential discovery", "Custom payload staging", "Bypassing email security filters", "Living off the Land (LOLBAS)"]},
        {"module": 2, "title": "Web Application Penetration Testing", "duration": "3 Weeks", "topics": ["OWASP Top 10 beyond basics", "Server-Side Request Forgery (SSRF) exploitation", "IDOR & complex business logic vulnerabilities", "Blind SQLi and GraphQL pentesting"]},
        {"module": 3, "title": "Active Directory Exploitation & Domination", "duration": "5 Weeks", "topics": ["BloodHound graph attack vectors", "Kerberoasting, AS-REP Roasting & Unconstrained Delegation", "Active Directory Certificate Services (AD CS) abuse", "Golden & Silver ticket forging"]},
        {"module": 4, "title": "Defense Evasion & EDR Bypass", "duration": "3 Weeks", "topics": ["AMSI bypass techniques", "API hooking unhooking & direct system calls", "Process injection and reflective DLL loading", "Evading behavior-based heuristic detection"]},
        {"module": 5, "title": "Command & Control (C2) & Post-Exploitation", "duration": "3 Weeks", "topics": ["Sliver & Mythic C2 infrastructure design", "Domain persistence mechanisms", "Internal lateral movement via WinRM, SMB, SSH", "Data exfiltration via DNS tunneling"]}
    ]'::jsonb,
    '[
        "Execute end-to-end adversary emulation campaigns against hardened enterprise networks",
        "Identify and exploit subtle misconfigurations in complex multi-domain Active Directory forests",
        "Write custom C++ and PowerShell shellcode loaders that slip past tier-1 antivirus and EDRs",
        "Conduct thorough web application audits and discover high-impact zero-day style bugs",
        "Qualify confidently for global offensive credentials such as OSCP, CRTO, and CRTP"
    ]'::jsonb,
    '[
        "Solid familiarity with Linux and Windows operating system internals",
        "Basic knowledge of scripting (Python, PowerShell, or Bash)",
        "Foundational understanding of web protocols and networking"
    ]'::jsonb,
    '["Kali Linux", "Burp Suite Pro", "BloodHound", "Impacket", "Mimikatz", "Sliver C2", "Metasploit", "Responder", "Ghidra", "Cobalt Strike concepts"]'::jsonb
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'cloud-security-devsecops-engineering',
    'Cloud Security Architecture & DevSecOps Engineering',
    'Architect Resilient Multi-Cloud Defenses Across AWS, Azure & Kubernetes',
    'Bridging cloud infrastructure and security. Automate security guardrails into CI/CD pipelines and protect cloud-native serverless and containerized systems.',
    'As organizations accelerate cloud adoption, cloud security engineers are among the most sought-after tech professionals globally. This course arms you with practical knowledge in AWS/Azure IAM hardening, Infrastructure as Code (Terraform) security, Kubernetes container defense, and automated pipeline scanning.',
    'Intermediate',
    10,
    8,
    42999.00,
    'INR',
    'published',
    FALSE,
    'IN DEMAND',
    'EV Certified Cloud Security Engineer (ECCSE)',
    CURRENT_DATE + INTERVAL '28 days',
    12,
    '[
        {"module": 1, "title": "Cloud Fundamentals & Identity Governance (IAM)", "duration": "2 Weeks", "topics": ["AWS & Azure IAM deep dive", "Least privilege policy engineering", "CloudTrail & CloudWatch security monitoring", "AssumeRole and cross-account trust attacks"]},
        {"module": 2, "title": "Infrastructure as Code (IaC) Security", "duration": "2 Weeks", "topics": ["Terraform static analysis with tfsec & Checkov", "GitOps security workflows", "Policy-as-code using Open Policy Agent (OPA)", "Detecting cloud misconfigurations"]},
        {"module": 3, "title": "Container & Kubernetes Security", "duration": "3 Weeks", "topics": ["Docker image hardening & vulnerability scanning", "Kubernetes RBAC, Pod Security Standards & NetworkPolicies", "Falco runtime threat detection", "Container breakout mitigations"]},
        {"module": 4, "title": "DevSecOps CI/CD Automation", "duration": "3 Weeks", "topics": ["SAST, DAST, and SCA integration in GitHub Actions", "Secret management with HashiCorp Vault", "Container image signing with Cosign", "Automated compliance and remediation"]}
    ]'::jsonb,
    '[
        "Audit and harden complex AWS and Azure enterprise cloud architectures",
        "Implement automated security scans in GitHub Actions and GitLab CI pipelines",
        "Secure production Kubernetes clusters using runtime intrusion detection with Falco",
        "Prevent credential leaks and enforce strict zero-trust IAM boundaries",
        "Bridge software development and security engineering teams seamlessly"
    ]'::jsonb,
    '[
        "Basic cloud awareness (AWS or Azure foundational knowledge)",
        "Experience with Docker or basic command line",
        "Understanding of Git version control"
    ]'::jsonb,
    '["AWS CloudTrail", "Azure Sentinel", "Terraform", "Checkov", "Kubernetes", "Falco", "Trivy", "GitHub Actions", "HashiCorp Vault", "OPA"]'::jsonb
),
(
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f90',
    'cybersecurity-foundations-career-track',
    'Cybersecurity Engineering Fundamentals (Zero to Hero)',
    'The Definitive Foundation for Aspiring Cybersecurity Professionals & Career Switchers',
    'Structured from absolute ground up for beginners, college graduates, and IT pros pivoting into the cybersecurity industry.',
    'Designed to turn complete newcomers into skilled entry-level security analysts. Covers operating systems, TCP/IP networking, security architecture, cryptography, vulnerability management, and hands-on lab projects to kickstart your cybersecurity career.',
    'Beginner',
    8,
    6,
    29999.00,
    'INR',
    'published',
    FALSE,
    'BEGINNER FRIENDLY',
    'EV Cyber Defense Associate (ECDA)',
    CURRENT_DATE + INTERVAL '10 days',
    15,
    '[
        {"module": 1, "title": "Computer Networks & System Architecture", "duration": "2 Weeks", "topics": ["OSI vs TCP/IP models", "Subnetting, routing & firewall rules", "Linux and Windows OS internals", "Virtualization & lab setup"]},
        {"module": 2, "title": "Core Security Principles & Cryptography", "duration": "2 Weeks", "topics": ["Confidentiality, Integrity, Availability (CIA triad)", "Symmetric vs Asymmetric encryption", "PKI, SSL/TLS, and digital certificates", "Hashing & message authentication"]},
        {"module": 3, "title": "Vulnerability Assessment & Defense Strategies", "duration": "2 Weeks", "topics": ["Vulnerability scanning with Nessus & Nmap", "Common vulnerabilities & exposures (CVE/CVSS)", "Patch management best practices", "Antivirus & endpoint defenses"]},
        {"module": 4, "title": "Cybersecurity Roles, Tooling & Interview Prep", "duration": "2 Weeks", "topics": ["SOC vs Pentesting vs GRC career pathways", "Resume tailoring & LinkedIn optimization", "Mock technical interviews", "Capstone hands-on defense lab"]}
    ]'::jsonb,
    '[
        "Build and configure private hands-on cybersecurity home labs",
        "Conduct thorough network port scans and vulnerability assessments",
        "Understand real-world adversary tactics and defense mechanisms",
        "Confidently crack entry-level security analyst and engineer technical interviews"
    ]'::jsonb,
    '[
        "No prior coding or security experience required",
        "Basic computer literacy and a hunger to learn defensive tech"
    ]'::jsonb,
    '["Linux (Ubuntu)", "Nmap", "Nessus", "Wireshark", "VirtualBox", "OpenSSL", "OWASP ZAP", "Hashcat basics"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 2. VIDEOS SEED (Admin-Controlled YouTube Management)
INSERT INTO public.videos (
    id, title, description, youtube_url, youtube_video_id,
    placement, pinned_homepage, pinned_course_id, is_active,
    autoplay, muted_autoplay, show_controls, sort_order
) VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Inside the EV Cyber War Room: Live Cyber Range Walkthrough',
    'A walkthrough of our live-fire cyber range, real-time intrusion simulations, and practical training methodology.',
    'https://www.youtube.com/watch?v=inWWhr5tnEA',
    'inWWhr5tnEA',
    'hero',
    TRUE,
    NULL,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    1
),
(
    '22222222-2222-2222-2222-222222222222',
    'SOC Analyst L1/L2 Program Overview & Lab Architecture',
    'Detailed overview of the 12-week Certified SOC Analyst syllabus, live SIEM lab environment, and triage exercises.',
    'https://www.youtube.com/watch?v=3Kq1MIfTWCE',
    '3Kq1MIfTWCE',
    'course_details',
    FALSE,
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    2
),
(
    '33333333-3333-3333-3333-333333333333',
    'Offensive Red Team Track: Active Directory Exploitation Preview',
    'Demonstration of modern Kerberos ticket forging and defensive evasion tactics covered in our 16-week Offensive Security Track.',
    'https://www.youtube.com/watch?v=2ePf9rue1Ao',
    '2ePf9rue1Ao',
    'course_details',
    FALSE,
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    TRUE,
    FALSE,
    TRUE,
    TRUE,
    3
)
ON CONFLICT (id) DO NOTHING;

-- 3. FAQS SEED
INSERT INTO public.faqs (category, question, answer, sort_order, is_active) VALUES
(
    'Admissions & Eligibility',
    'Who are EV Cyber Academy programs designed for?',
    'Our programs are engineered for ambitious students, fresh graduates, IT professionals, and software engineers looking to build serious, high-paying careers in cybersecurity (Blue Team, Red Team, or Cloud Sec). We offer both foundational tracks for starters and advanced tracks for experienced tech professionals.',
    1,
    TRUE
),
(
    'Curriculum & Labs',
    'What makes EV Cyber Academy different from generic video courses?',
    'We provide live enterprise lab environments, dedicated cloud cyber ranges, real adversary capture-the-flag exercises, and live mentorship from practicing cybersecurity leads. You don''t just watch videos—you triage real attacks, investigate live pcap traces, and write production security policies.',
    2,
    TRUE
),
(
    'Career & Mentorship',
    'Do you assist with job placement and interviews?',
    'Yes. Every enrolled candidate receives 1-on-1 resume optimization tailored for Applicant Tracking Systems (ATS), technical mock interviews with enterprise hiring managers, and direct referrals through our cybersecurity hiring network.',
    3,
    TRUE
),
(
    'Schedule & Flexibility',
    'Can working professionals attend these batches?',
    'All batches feature evening and weekend live sessions with recorded backups, 24/7 dedicated Discord lab support, and flexible self-paced cyber range access designed specifically around professional work schedules.',
    4,
    TRUE
),
(
    'Registration & Process',
    'What happens after I submit the course application form?',
    'Once you submit the registration form, our academic counseling team reviews your background within 24 hours. A counselor will reach out via call/WhatsApp to discuss prerequisites, answer your questions, and guide you through batch reservation.',
    5,
    TRUE
);

-- 4. SITE SETTINGS SEED (Admin-Controlled Content)
INSERT INTO public.site_settings (key, value, description) VALUES
(
    'hero_content',
    '{
        "badge": "ADMISSIONS OPEN FOR NEXT COHORT",
        "headline_prefix": "Engineering Elite",
        "headline_highlight": "Cyber Defenders & Offensive Specialists",
        "subheadline": "Real-world cyber ranges. Enterprise SIEM & Red Team labs. Zero fluff. Accelerate your career into high-impact cybersecurity roles with elite mentorship.",
        "primary_cta_text": "Explore Programs & Apply",
        "secondary_cta_text": "Watch Cyber Range Demo",
        "trust_badge_text": "Live Enterprise Cyber Range & Security Operations Training"
    }'::jsonb,
    'Homepage Hero section headline and copy'
),
(
    'contact_info',
    '{
        "phone": "+91 98765 43210",
        "email": "admissions@evcyberacademy.com",
        "whatsapp": "+919876543210",
        "address": "Cyber Defense Complex, Tech Corridor, Bangalore & Online Worldwide",
        "counseling_hours": "Mon - Sat: 9:00 AM - 8:00 PM IST"
    }'::jsonb,
    'Official contact phone, email and whatsapp'
)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
