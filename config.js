module.exports = {
    apiDomain: "https://graph.facebook.com",
    apiVersion: "v11.0",

    get apiUrl() {
        return `${this.apiDomain}/${this.apiVersion}`;
    },
}