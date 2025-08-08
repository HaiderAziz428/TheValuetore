// Reviews API route using Supabase REST without external deps
// Supports: GET ?product_id=... and POST JSON body
// Env vars (either pair works):
// - SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY
// - NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY

function requiredEnv() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing Supabase environment variables. Set SUPABASE_URL and key (or NEXT_PUBLIC_ equivalents)."
    );
  }
  return { url, key };
}

export default async function handler(req, res) {
  try {
    const { url, key } = requiredEnv();

    if (req.method === "GET") {
      const { product_id } = req.query;
      if (!product_id) {
        return res.status(400).json({
          error: true,
          message: "Missing required query param: product_id",
        });
      }

      const endpoint = `${url}/rest/v1/reviews?select=*&product_id=eq.${encodeURIComponent(
        product_id
      )}&order=created_at.desc`;

      const r = await fetch(endpoint, {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: "application/json",
        },
      });

      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: true, message: text });
      }

      const data = await r.json();
      return res.status(200).json({ rows: data, count: data.length });
    }

    if (req.method === "POST") {
      const {
        product_id,
        rating,
        headline,
        comment,
        reviewer_name = "Anonymous",
        images = [],
      } = req.body || {};

      if (!product_id || !rating || !comment) {
        return res.status(400).json({
          error: true,
          message: "Missing required fields: product_id, rating, comment",
        });
      }

      const row = {
        product_id: String(product_id),
        rating: Number(rating),
        headline:
          headline && String(headline).trim().length > 0
            ? headline
            : String(comment).slice(0, 80) || "Review",
        comment: String(comment),
        reviewer_name: String(reviewer_name || "Anonymous"),
        images: Array.isArray(images) ? images : [],
      };

      const r = await fetch(`${url}/rest/v1/reviews`, {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify([row]),
      });

      if (!r.ok) {
        const text = await r.text();
        return res.status(r.status).json({ error: true, message: text });
      }

      const data = await r.json();
      return res.status(201).json({ row: data && data[0] ? data[0] : row });
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: true, message: "Method not allowed" });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/reviews error:", err);
    return res
      .status(500)
      .json({ error: true, message: err.message || "Server error" });
  }
}
