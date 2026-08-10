import { colors } from "@/lib/design-tokens";

type SectionLabelProps = Readonly<{
  children: string;
  dark?: boolean;
}>;

export default function SectionLabel({ children, dark = false }: SectionLabelProps) {
  return (
    <div className="section-label" style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.15em", textTransform: "uppercase", color: dark ? colors.goldLight : colors.goldPrimary }}>
        {children}
      </span>
      <span style={{ display: "inline-block", width: 40, height: 2, background: dark ? colors.goldLight : colors.goldPrimary }} />
    </div>
  );
}
