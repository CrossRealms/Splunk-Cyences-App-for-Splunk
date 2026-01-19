export function resolveTimeRange(
  earliest: string | number | null | undefined,
  latest: string | number | null | undefined
) {
  if (!earliest && !latest) {
    return {
      type: "relative",
      earliest: "-24h",
      latest: "now",
    };
  }

  if (
    typeof earliest === "string" &&
    (earliest.includes("-") || earliest.includes("@"))
  ) {
    return {
      type: "relative",
      earliest,
      latest: latest || "now",
    };
  }

  return {
    type: "absolute",
    earliest: Number(earliest),
    latest: latest ? Number(latest) : Date.now() / 1000,
  };
}
