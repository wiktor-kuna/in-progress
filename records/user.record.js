const { pool } = require("../utils/db");
const { ValidationError } = require("../utils/errors");
const {hash, compare} = require('bcrypt');

class UserRecord{
    constructor(obj, reg = false) {
        if (obj.login.includes("/") || obj.login.includes("?")) {
            throw new ValidationError(`Login can't includes "?" and "/" signs.`)
        }
        if (obj.login.length < 3 || obj.login.length > 30) {
            throw new ValidationError('Login must have at least 3 characters and maximum of 30 characters.');
        }
        if (reg && (obj.password.length < 5 || obj.password.length > 25)) {
            throw new ValidationError('Password must have at least 5 characters and maximum of 25 characters..');
        }
        if (obj.name.length < 3 || obj.name.length > 20) {
            throw new ValidationError('Name must have at least 3 characters and maximum of 20 characters.');
        }
        if (obj.surname.length < 3 || obj.surname.length > 20) {
            throw new ValidationError('Surname must have at least 3 characters and maximum of 20 characters..');
        }
        if (obj.email.length < 6 || obj.email.length > 30) {
            throw new ValidationError('E-mail must have at least 6 characters and maximum of 30 characters..');
        }
        if (!obj.email.includes('@')) {
            throw new ValidationError('The email address must have "@"');
        }
        this.login = obj.login;
        this.name = obj.name;
        this.surname = obj.surname;
        this.email = obj.email;
        this.password = obj.password;
        this.isAdmin = obj.isAdmin ? obj.isAdmin : 0;
        this.isActive = obj.isActive ? obj.isActive : 0;
        this.coins = reg ? 0 : obj.coins;
    }

    static async saveCoins(login, coins) {
        await pool.execute("UPDATE `users` SET `coins` = :coins WHERE `users`.`login` = :login;", {
            login,
            coins,
        });
    }

    static async loadCoins(login) {
        const coins =  await pool.execute("SELECT `coins` FROM `users` WHERE `login` = :login;", {
            login,
        });
        return coins[0][0].coins;
    }

    static async isActive(login) {
        const isActive =  await pool.execute("SELECT `isActive` FROM `users` WHERE `login` = :login;", {
            login,
        });
        return isActive[0][0].isActive;
    }

    static async isAdmin(login) {
        const isAdmin =  await pool.execute("SELECT `isAdmin` FROM `users` WHERE `login` = :login;", {
            login,
        });
        return isAdmin[0][0].isAdmin;
    }

    async insert() {
        try{
            const hashedPass = await hash(this.password, 10);
            await pool.execute("INSERT INTO `users` (`login`, `registered`, `name`, `surname`, `email`, `password`, `coins`) VALUES (:login, current_timestamp(), :name, :surname, :email, :password, :coins);", {
                login: this.login,
                name: this.name,
                surname: this.surname,
                email: this.email,
                password: hashedPass,
                coins: this.coins,
            });
            console.log('User', this.login, 'is added.');
            return this.login;
        } catch (err) {
            if (err.errno === 1062) {
                throw new ValidationError(`Sorry. The login ${this.login} already exists. Please choose another one.`);
            } else if (err.code === 'ECONNREFUSED'){
                throw new ValidationError(`Sorry. You are not connected to a database`);            }
        }
    }

    static async delete(login) {
            await pool.execute('DELETE FROM `users` WHERE `login` = :login', {
                login,
            })
    }

    static async find(login) {
        const [results] = await pool.execute('SELECT * FROM `users` WHERE `login` = :login', {
            login,
        });
        return new UserRecord(results[0]);
    }

    static async login(login, password) {
        try {
            const [results] = await pool.execute('SELECT * FROM `users` WHERE `login` = :login;', {
                login,
                // password
            }); 
            const comp = await compare(password, results[0].password);
            console.log(comp);

            if (comp) {
                return new UserRecord(results[0]);
            } else {
                throw new ValidationError('The values of login and password are incorrect. Please try again.');
            }
        }
        catch (e) {
            throw new ValidationError('The values of login and password are incorrect. Please try again.');
        }
    }

    static async getToActivate() {
        const [results] = await pool.execute('SELECT `login`, `isAdmin`, `isActive` FROM `users`');
        return results;
    }

    static async changeActive(login) {
        const [[result]] = await pool.execute('SELECT `isActive` FROM `users` WHERE `users`.`login` = :login;', {
            login
        });
        console.log(result.isActive);
            await pool.execute("UPDATE `users` SET `isActive` = :isActive WHERE `users`.`login` = :login;", {
                isActive: result.isActive ? null : 1,
                login,
            });
    }

    static async changeAdmin(login) {
        const [[result]] = await pool.execute('SELECT `isAdmin` FROM `users` WHERE `users`.`login` = :login;', {
            login
        });
        console.log(result.isAdmin);
            await pool.execute("UPDATE `users` SET `isAdmin` = :isAdmin WHERE `users`.`login` = :login;", {
                isAdmin: result.isAdmin ? null : 1,
                login,
            });
    }

    static async all() {
        const results = await pool.execute('SELECT * FROM `users`');
        console.log(results[0]);
        return results[0];
    }
}

module.exports = {
    UserRecord
}