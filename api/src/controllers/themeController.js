import Setting from '../models/Setting.js';

export const THEMES = ['default', 'playful'];
const THEME_KEY = 'activeTheme';

export async function getActiveTheme(req, res) {
  const setting = await Setting.findOne({ key: THEME_KEY });
  res.json({ theme: setting?.value || 'default' });
}

export async function setActiveTheme(req, res) {
  const { theme } = req.body;
  if (!THEMES.includes(theme)) {
    return res.status(422).json({ error: `Theme must be one of: ${THEMES.join(', ')}` });
  }

  await Setting.findOneAndUpdate(
    { key: THEME_KEY },
    { value: theme },
    { upsert: true, new: true }
  );

  res.json({ theme });
}
