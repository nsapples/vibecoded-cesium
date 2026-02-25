module.exports = (req, res) => {
  const key = process.env.GOOGLE_KEY;
  if (!key) return res.status(500).json({ ok: false, error: "Missing GOOGLE_KEY" });
  res.json({ ok: true, tileKey: key });
};
