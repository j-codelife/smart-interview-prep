// routes/interview.js
const express = require("express");
const router = express.Router();

const db = require("../db/database");

/**
 * POST /api/interview/start
 * Body: { role: string, topics: string }
 * Creates a new session and returns sessionId + first question (currently simple placeholder question).
 */
router.post("/start", (req, res) => {
  try {
    const { role, topics } = req.body;

    if (!role || !topics) {
      return res.status(400).json({ error: "role and topics are required" });
    }

    const insertSession = db.prepare(
      "INSERT INTO sessions (role, topics) VALUES (?, ?)"
    );
    const result = insertSession.run(role, topics);

    const sessionId = result.lastInsertRowid;

    // Placeholder question for now (we'll swap this with real AI-generated question next)
    const question = `Explain a key concept related to ${topics} for a ${role} interview.`;

    return res.status(201).json({ sessionId, question });
  } catch (err) {
    console.error("Error in /start:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * POST /api/interview/answer
 * Body: { sessionId: number, question: string, answer: string }
 * Stores the response and returns feedback + score (currently placeholder).
 */
router.post("/answer", (req, res) => {
  try {
    const { sessionId, question, answer } = req.body;

    if (!sessionId || !question || !answer) {
      return res.status(400).json({
        error: "sessionId, question, and answer are required",
      });
    }

    // Placeholder feedback/score (we'll swap this with AI evaluation next)
    const feedback = "Good start. Add edge cases and discuss time complexity.";
    const score = 7;

    const insertResponse = db.prepare(`
      INSERT INTO responses (session_id, question, answer, feedback, score)
      VALUES (?, ?, ?, ?, ?)
    `);

    insertResponse.run(sessionId, question, answer, feedback, score);

    return res.json({ feedback, score });
  } catch (err) {
    console.error("Error in /answer:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/interview/sessions
 * Returns all sessions (most recent first).
 */
router.get("/sessions", (req, res) => {
  try {
    const sessions = db
      .prepare("SELECT * FROM sessions ORDER BY id DESC")
      .all();
    return res.json(sessions);
  } catch (err) {
    console.error("Error in /sessions:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * GET /api/interview/sessions/:id
 * Returns a single session + its responses.
 */
router.get("/sessions/:id", (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid session id" });
    }

    const session = db.prepare("SELECT * FROM sessions WHERE id = ?").get(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const responses = db
      .prepare(
        "SELECT * FROM responses WHERE session_id = ? ORDER BY id ASC"
      )
      .all(id);

    return res.json({ session, responses });
  } catch (err) {
    console.error("Error in /sessions/:id:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;