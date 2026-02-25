module.exports = (req, res) => {
  const tileKey = process.env.NEXT_PUBLIC_TILE_KEY;
  if (!tileKey) return res.status(500).json({ ok: false, error: "Missing NEXT_PUBLIC_TILE_KEY" });
  res.json({ ok: true, tileKey });
};
