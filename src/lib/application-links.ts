export const MENTOR_APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdnB27BbZ4wUd7aVfZo8Eanlq9ijJEtZuvW8Wq5VMXA-I4zYQ/viewform";

export const MENTEE_APPLICATION_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScXhKpGJfCzpNECrDxwJMyRcOD1lZ2GXpN1F08j8mfHpyNF7A/viewform";

export const applicationUrlFor = (role: string) => {
  if (role === "mentor") return MENTOR_APPLICATION_URL;
  if (role === "mentee") return MENTEE_APPLICATION_URL;
  return `/get-involved?role=${role}#apply`;
};
