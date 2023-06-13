// helper to apply gradient effect to text
function splitSiteName(siteName: string): { siteName: string, siteNamePrefix: string, siteNameSuffix: string } {
    const siteNameParts = siteName.split(" ");
    let siteNamePrefix = '';
    let siteNameSuffix = '';
    // if there are at least 3 parts, all words except the first and last are considered the site name
    if (siteNameParts.length > 2) {
        // first word is prefix
        siteNamePrefix = siteNameParts[0];
        // last word is suffix
        siteNameSuffix = siteNameParts[siteNameParts.length - 1];
        // all words in between are the site name
        siteNameParts.shift();
        siteNameParts.pop();
        siteName = siteNameParts.join(" ");
    }
    return { 
        siteName: siteName,
        siteNamePrefix: siteNamePrefix,
        siteNameSuffix: siteNameSuffix
    };
}

export default splitSiteName;