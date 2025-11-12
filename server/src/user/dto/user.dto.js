class UserDto {
    constructor(user) {
        this.id = user.id;
        this.email = user.email;
        this.password = user.password;
    }

    toJSON() {
        return {
            id: this.id,
            email: this.email,
            password: this.password,
        };
    }
}

module.exports = UserDto;