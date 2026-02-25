module.exports = async (req, res) => {
  const oLat = Number(req.query.oLat), oLng = Number(req.query.oLng);
  const dLat = Number(req.query.dLat), dLng = Number(req.query.dLng);

  if (![oLat, oLng, dLat, dLng].every(Number.isFinite)) {
    return res.status(400).json({ ok: false, error: "Missing/invalid oLat,oLng,dLat,dLng" });
  }

  const key = process.env.GOOGLE_KEY;
  if (!key) return res.status(500).json({ ok: false, error: "Missing GOOGLE_KEY" });

  const url = "https://routes.googleapis.com/directions/v2:computeRoutes";

  const r = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": key,
      "X-Goog-FieldMask": "routes.polyline.encodedPolyline"
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: oLat, longitude: oLng } } },
      destination: { location: { latLng: { latitude: dLat, longitude: dLng } } },
      travelMode: "DRIVE"
    })
  });

  const data = await r.json();

  if (!r.ok || !data.routes?.length) {
    return res.status(400).json({ ok: false, error: data.error?.message || "Route failed", raw: data });
  }

  res.json({ ok: true, encodedPolyline: data.routes[0].polyline.encodedPolyline });
};
