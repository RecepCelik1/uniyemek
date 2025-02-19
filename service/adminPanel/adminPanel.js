const UserAuthService = require('../userAuthService');

class adminPanel {
    constructor() {
        this.userAuthService = new UserAuthService()
    }

    async checkUserAuthority (sessionToken) {
        const admin = await this.userAuthService.validateSessionToken(sessionToken);
        if(admin.role !== "Admin"){
            throw new Error("UnauthorizedAccess");
        }
        return admin;
    }

}

module.exports = adminPanel;