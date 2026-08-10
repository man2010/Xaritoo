export const colors = {
  purplePrimary: "#5B2C83",
  purpleDark: "#32194D",
  purpleLavender: "#F2ECF7",
  goldPrimary: "#B58A2A",
  goldLight: "#E2C878",
  greenGrowth: "#4F7D55",
  greenLight: "#EAF2EA",
  textDark: "#251C2D",
  textBody: "#40364A",
  textMuted: "#746C7A",
  bgSoft: "#FAF8FC",
  white: "#FFFFFF",
} as const;

export const unsplashImage = (id: string, width = 1200, height = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&auto=format`;
