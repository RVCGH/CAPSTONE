require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

const pendingUsers = [];
const users = [
  {
    id: crypto.randomUUID(),
    name: "Admin",
    email: "admin@test.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    isVerified: true
  },
  {
    id: crypto.randomUUID(),
    name: "Dr. Daniel Santos",
    email: "dentist@test.com",
    password: bcrypt.hashSync("123456", 10),
    role: "dentist",
    isVerified: true
  }
];

const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL || "http://localhost:3000";
const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendVerificationEmail(name, email, token) {
  const verifyUrl = `${BACKEND_PUBLIC_URL}/verify-email?token=${token}`;

  await transporter.sendMail({
    from: `"Dental System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hello, ${name}!</h2>
        <p>Thank you for registering at Ganal-Mappala Dental Clinic.</p>
        <p>Please click the button below to verify your email address:</p>
        <p>
          <a href="${verifyUrl}" style="
            display:inline-block;
            padding:12px 20px;
            background:#2563eb;
            color:#ffffff;
            text-decoration:none;
            border-radius:8px;
            font-weight:bold;
          ">
            Verify My Account
          </a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p>${verifyUrl}</p>
      </div>
    `
  });
}

// ==============================
// REGISTER
// ==============================
app.post("/register", async (req, res) => {
  try {
    let { name, email, password, sex, dob, mobile } = req.body;

    name = String(name || "").trim();
    email = String(email || "").trim().toLowerCase();
    password = String(password || "");
    sex = String(sex || "");
    dob = String(dob || "");
    mobile = String(mobile || "").trim();

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const verifiedUser = users.find((u) => u.email.toLowerCase() === email);

    if (verifiedUser) {
      return res.status(409).json({ message: "Email is already registered." });
    }

    const existingPending = pendingUsers.find((u) => u.email.toLowerCase() === email);

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    if (existingPending) {
      existingPending.name = name;
      existingPending.password = hashedPassword;
      existingPending.sex = sex;
      existingPending.dob = dob;
      existingPending.mobile = mobile;
      existingPending.verificationToken = verificationToken;

      await sendVerificationEmail(name, email, verificationToken);

      return res.status(200).json({
        message: "Verification email resent. Please check your inbox.",
        email
      });
    }

    const pendingUser = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      sex,
      dob,
      mobile,
      role: "patient",
      isVerified: false,
      verificationToken
    };

    await sendVerificationEmail(name, email, verificationToken);
    pendingUsers.push(pendingUser);

    return res.status(201).json({
      message: "Registration successful. Verification email sent.",
      email
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      message: "Could not send verification email. Please try again."
    });
  }
});

// ==============================
// VERIFY EMAIL
// ==============================
app.get("/verify-email", (req, res) => {
  try {
    const { token } = req.query;

    const pendingIndex = pendingUsers.findIndex((u) => u.verificationToken === token);

    if (pendingIndex === -1) {
      return res.status(400).send(`
        <h2>Invalid or expired verification link.</h2>
      `);
    }

    const verifiedUser = pendingUsers[pendingIndex];
    verifiedUser.isVerified = true;
    verifiedUser.verificationToken = null;

    users.push(verifiedUser);
    pendingUsers.splice(pendingIndex, 1);

    return res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Email Verified</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background: #f4f8ff;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
          }
          .card {
            background: white;
            padding: 40px;
            border-radius: 20px;
            box-shadow: 0 12px 32px rgba(37,99,235,0.15);
            text-align: center;
            max-width: 460px;
          }
          h2 { color: #16a34a; margin-bottom: 10px; }
          p { color: #475569; line-height: 1.6; }
        </style>
      </head>
      <body>
        <div class="card">
          <h2>Email Verified Successfully</h2>
          <p>Your email <strong>${verifiedUser.email}</strong> is now verified and registered.</p>
          <p>You may now close this page.</p>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).send("<h2>Server error during verification.</h2>");
  }
});

// ==============================
// VERIFICATION STATUS
// ==============================
app.get("/verification-status", (req, res) => {
  try {
    const email = String(req.query.email || "").trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const verifiedUser = users.find((u) => u.email.toLowerCase() === email);

    if (verifiedUser) {
      return res.json({
        verified: true,
        registered: true,
        email
      });
    }

    const pendingUser = pendingUsers.find((u) => u.email.toLowerCase() === email);

    if (pendingUser) {
      return res.json({
        verified: false,
        registered: false,
        pending: true,
        email
      });
    }

    return res.json({
      verified: false,
      registered: false,
      pending: false,
      email
    });
  } catch (error) {
    console.error("Verification status error:", error);
    return res.status(500).json({
      message: "Server error checking verification status."
    });
  }
});

// ==============================
// LOGIN
// ==============================
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;

    email = String(email || "").trim().toLowerCase();
    password = String(password || "");

    const user = users.find((u) => u.email.toLowerCase() === email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.json({
      message: "Login successful.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || "patient",
        sex: user.sex || "",
        dob: user.dob || "",
        mobile: user.mobile || "",
        address: user.address || "",
        condition: user.condition || ""
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login." });
  }
});

// ==============================
// GEMINI PATIENT CHAT
// ==============================
app.post("/api/patient-chat", async (req, res) => {
  try {
    const {
      message,
      currentSection,
      selectedService,
      selectedPrice,
      appointmentStatus,
      paymentStatus,
      patientName
    } = req.body;

    const numericPrice = Number(selectedPrice || 0);

    const systemPrompt = `
You are G-M Dental Patient Assistant for the G-M Dental patient portal.

Your job is to answer ONLY as the website assistant for this clinic system.

IMPORTANT BEHAVIOR:
- Be friendly, short, clear, and specific to this portal.
- Do not sound generic.
- Do not give broad "it depends on the clinic" answers when the clinic rule is already known.
- Use the actual clinic rules below.
- If the answer is not in the clinic rules or patient context, say: "Please contact the clinic directly for that detail."
- Do not diagnose diseases.
- Do not prescribe medicine.
- Give only general oral health guidance.
- If the user mentions severe pain, swelling, fever, pus, heavy bleeding, infection, or emergency symptoms, advise them to contact the clinic directly as soon as possible.

CLINIC SERVICES AND SAMPLE PRICES:
- Enhanced Infection Control — ₱300
- Consultation — ₱500
- Oral Prophylaxis — ₱1,000
- Restorative Treatment — ₱800
- Tooth Extraction — ₱1,000
- Odontectomy — ₱10,000
- Root Canal Treatment — ₱6,000
- Complete Denture — ₱15,000
- Partial Denture (Stayplate) — ₱6,500
- Partial Denture (Casted) — ₱12,000
- Flexible Denture — ₱16,000
- Crowns and Bridges — ₱6,000
- Orthodontic Treatment — ₱60,000
- Retainers — ₱6,000
- Mouth Guard — ₱6,000
- Whitening — ₱12,000
- Periapical X-Ray — ₱500
- Panoramic X-Ray — ₱1,000

BOOKING FLOW:
1. Select service
2. Choose date and time
3. Confirm booking
4. Pay downpayment if required

PAYMENT RULE:
- If selected service price is ₱3000 or higher, downpayment is required.
- If selected service price is below ₱3000, downpayment is not required.
- Payment methods available: GCash, Card, Cash.

APPOINTMENT STATUS GUIDE:
- Pending = waiting for clinic approval
- Approved = accepted by clinic
- Upcoming = confirmed upcoming appointment
- Completed = finished appointment
- Cancelled = cancelled appointment
- Rejected = clinic did not approve the appointment
- Reschedule Requested = a request to move appointment date/time is being reviewed

CURRENT PATIENT CONTEXT:
- Patient name: ${patientName || "Patient"}
- Current section: ${currentSection || "unknown"}
- Selected service: ${selectedService || "none"}
- Selected price: ₱${numericPrice}
- Appointment status: ${appointmentStatus || "unknown"}
- Payment status: ${paymentStatus || "unknown"}

SPECIAL RESPONSE RULES:
- If the user asks whether downpayment is needed, answer directly using the selected price if available.
- If selected price is 3000 or higher, clearly say that downpayment is required.
- If selected price is below 3000 and greater than 0, clearly say that downpayment is not required.
- If no service is selected yet, explain the rule: downpayment is required only for services worth ₱3000 and above.
- If the user asks about status, explain the exact meaning of the current status if available.
- If the user asks about booking, guide them using the actual booking flow above.
`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${systemPrompt}\n\nPatient message: ${message}`
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);
      return res.status(500).json({
        reply: "Sorry, the chatbot is temporarily unavailable."
      });
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I could not answer that right now.";

    return res.json({ reply });
  } catch (error) {
    console.error("Gemini chatbot error:", error);
    return res.status(500).json({
      reply: "Sorry, the chatbot is temporarily unavailable."
    });
  }
});

// ==============================
// START SERVER
// ==============================
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);

  try {
    await transporter.verify();
    console.log("Mailer is ready.");
  } catch (err) {
    console.error("Mailer error:", err.message);
  }
});