module.exports = async (req, res) => {
  const address = String(req.query.address || "").trim();
  if (!address) return res.status(400).json({ ok: false, error: "Missing address" });

  const key = process.env.GOOGLE_SERVER_KEY;
  if (!key) return res.status(500).json({ ok: false, error: "Missing GOOGLE_SERVER_KEY" });

  const url =
    "https://maps.googleapis.com/maps/api/geocode/json" +
    `?address=${encodeURIComponent(address)}` +
    `&key=${encodeURIComponent(key)}`;

  const r = await fetch(url);
  const data = await r.json();

  if (data.status !== "OK" || !data.results?.length) {
    return res.status(400).json({
      ok: false,
      error: data.error_message || data.status || "Geocode failed",
      raw: data
    });
  }

  const best = data.results[0];
  const loc = best.geometry.location;
  res.json({ ok: true, formatted: best.formatted_address, lat: loc.lat, lng: loc.lng });
};
