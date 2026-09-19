/** Anchor of a person on /people: the same slug as their content file id. */
export function personAnchor(name: string): string {
  const slug = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `/people/#${slug}`;
}
