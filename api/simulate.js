export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { elements } = req.body;

    // Direct mathematical state calculation loop
    const outputAnalysis = elements.map(el => {
      let operationalCurrent = "0mA";
      let statusString = "Offline";

      if (el.type === "Microcontroller") {
        operationalCurrent = "45mA";
        statusString = "Booted / Executing Loop";
      } else if (el.type === "LED") {
        operationalCurrent = "18mA";
        statusString = "Emitting Light State";
      }

      return { id: el.id, type: el.type, current: operationalCurrent, status: statusString };
    });

    return res.status(200).json({ success: true, telemetry: outputAnalysis });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
