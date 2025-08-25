import slugifyLib from "slugify";

function slugifyTitle(title) {
    return slugifyLib(title, { lower: true, strict: true });
};

export default slugifyTitle;