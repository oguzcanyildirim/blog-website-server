export function slugify(str: string): string {
    const regex = new RegExp(/\W+/, "gm");
    const slug = str.replace(regex, " ").toLowerCase().replace(" ", "-");
    return slug;
  }
  