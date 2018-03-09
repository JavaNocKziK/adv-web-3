let self = {
    admin: 0x00,
    session: 0x01,
    user: 0x02,
    check: (req, ...params) => {
        return new Promise((resolve) => {
            let result = { valid: true, code: 200 };
            params.forEach((param) => {
                switch(param) {
                    case self.admin:
                        result.valid = (req.session.admin ? result.valid : false);
                        break;
                    case self.session:
                        result.valid = (req.session ? result.valid : false);
                        break;
                    case self.user:
                        result.valid = ((req.session.userId == req.params.id) || (req.session.admin) ? result.valid : false);
                        break;
                }
            });
            result.code = (result.valid ? 200 : 403);
            resolve(result);
        });
    }
}

module.exports = self;