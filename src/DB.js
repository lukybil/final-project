import Rome from "./img/content/colleseum.jpg";
import Madrid from "./img/content/madrid.jpg";
import Vienna from "./img/content/vienna.jpg";
import London from "./img/content/london.jpg";

import profileImg from "./img/default-profile-picture.png"

const guestUser = {username: "Guest", email: "none", profileImg: profileImg, numberLikes: 0};

class User {
    constructor(data) {
        this.data = data;
    }
}

User.prototype.toString = () => {
    
}

class DB {
    usersMap = new Map([
        ["kingkong", {username: "kingkong", email: "kingkong@gmail.comm", password: "p", profileImg: "", numberLikes: 0}],
        ["godzilla", {username: "godzilla", email: "gzilla@gmail.comm", password: "p", profileImg: "", numberLikes: 0}],
        ["charlie", {username: "charlie", email: "ch.arlie@gmail.comm", password: "p", profileImg: "", numberLikes: 0}],
        ["boris", {username: "boris", email: "boris.sluklov@gmail.comm", password: "p", profileImg: "", numberLikes: 0}]
    ]);

    topUsersList = [];

    currentUser = guestUser;

    nextExpId = 2;

    experiences = [
        {
            id: 0,
            name: "A week in Madrid",
            img: Madrid,
            country: "Spain",
            city: "Madrid", 
            username: "kingkong",
            likes: new Set(["godzilla", "charlie", "boris"]),
            documentation: "ID for EU Citizens",
            budget: {from: 600, to: 800, notes: "Accomodation can be costly."},
            transportation: "Metro is very good",
            accomodation: "Nice",
            usefulLinks: ["spain.com", "madrid.es"],
            comments: [
                {username: "kingkong", date: "2021-11-14 21:56:48", content: "Yo bro, very cool trip bro, wassup btw how ya doin bro, yo cool?"}, 
                {username: "boris", date: "2021-11-15 15:01:03", content: "Hello broder, gud to see you."}
            ]
        },
        {
            id: 1,
            name: "A trip to Rome",
            img: Rome,
            country: "Italy",
            city: "Rome", 
            username: "godzilla",
            likes: new Set(["godzilla", "charlie", "boris"]),
            documentation: "ID for EU Citizens",
            budget: {from: 600, to: 800, notes: "Accomodation can be costly."},
            transportation: "Metro is available as well as okay buses.",
            accomodation: "Cheap on the outskirst but also dirty surroundings",
            usefulLinks: ["italy.com", "rome.it"],
            comments: [
                {username: "kingkong", date: "2021-11-17 21:40:32", content: "Hi so did you like it bra?"}
            ]
        }

    ]

    constructor(appSetCurrentUser) {
        this.appSetCurrentUser = appSetCurrentUser;
    }

    startup() {
        this.updateUserLikesAmount();
        this.updateTopUsersList();
        setInterval(this.updateUserLikesAmount.bind(this), 1.5 * 60 * 1000);
        setInterval(this.updateTopUsersList.bind(this), 3 * 60 * 1000); //every 3 minutes, in ms
    }

    setAppSetCurrentUser(appSetCurrentUser) {
        this.appSetCurrentUser = appSetCurrentUser;
    }

    saveIntoLocalStorage() {
        this.experiences.forEach((exp) => {
            exp.likes = Array.from(exp.likes);
        });
        localStorage.setItem("usersMap", JSON.stringify([...this.usersMap]));
        localStorage.setItem("experiences", JSON.stringify(this.experiences));
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        localStorage.setItem("nextExpId", JSON.stringify(this.nextExpId));
        alert("Database saved!");
    }

    loadFromLocalStorage() {
        let protoUsersMap = new Map(JSON.parse(localStorage.getItem("usersMap")));
        let protoExperiences = JSON.parse(localStorage.getItem("experiences"));
        let protoCurrentUser = JSON.parse(localStorage.getItem("currentUser"));
        let protoNextExpId = JSON.parse(localStorage.getItem("nextExpId"));

        if (protoUsersMap.get("kingkong") !== undefined) {
            this.usersMap = protoUsersMap;
        }
        if (protoExperiences !== null) {
            this.experiences = protoExperiences;
            this.experiences.forEach((exp) => {
                exp.likes = new Set(exp.likes);
            });
        }
        if (protoCurrentUser !== null)
            this.currentUser = protoCurrentUser;
        if (protoNextExpId !== null)
            this.nextExpId = protoNextExpId;

        console.log("Database loaded.");
        console.log(this.experiences);
        console.log(this.usersMap);
        console.log(this.currentUser);
        console.log(this.nextExpId);

        this.startup(); //IMPORTANT
    }

    updateTopUsersList() {
        this.topUsersList = [];
        this.usersMap.forEach( (user) => {
            this.topUsersList.push(user);
        });
        this.topUsersList.sort((a, b) => b.numberLikes - a.numberLikes);
        this.topUsersList = this.topUsersList.slice(0, 10);
    }

    updateUserLikesAmount() {
        let newUsersMap = new Map(this.usersMap);
        newUsersMap.forEach( (user) => {
            user.numberLikes = 0;
        });
        this.experiences.forEach( (exp) => {
            let user = newUsersMap.get(exp.username)
            if (user !== undefined)
                user.numberLikes += exp.likes.size;
        });
        this.usersMap = newUsersMap;
    }

    getTopUsers() {
        return this.topUsersList;
    }

    checkExpAndFill(exp) {
		if (typeof exp !== 'object' ||
		Array.isArray(exp) ||
		exp === null)
		{	
			exp = {};
		}
		let propNames = ["id", "name", "country", "city", "username", "documentation", "budget", "transportation", "accomodation"];
		propNames.forEach( (prop) => {
			if (exp[prop] === undefined) {
				exp[prop] = "";
			}
		})
		if (exp.likes === undefined || !exp.likes instanceof Set) {
			exp.likes = new Set();
		}
		if (exp.usefulLinks === undefined || !Array.isArray(exp.usefulLinks)) {
			exp.usefulLinks = [];
		}
		if (exp.comments === undefined || !Array.isArray(exp.comments)) {
			exp.comments = [];
		}
		return exp;
	}

    getTopExp(amount) {
        let topExp = [...this.experiences];
        topExp.sort((a, b) => b.likes.size - a.likes.size);
        topExp = topExp.slice(0, amount);
        return topExp;
    }

    getExpById(id) {
        let exp = {};
        /*this.experiences.some( (e) => {
            if (e.id === id) {
                exp = e;
                return true;
            }
            return false;
        });*/
        exp = this.experiences[id];
        return exp;
    }

    addExp(exp) {
        this.checkExpAndFill(exp);
        console.log(exp);
        exp.id = this.nextExpId++;
        if (exp !== undefined)
            this.experiences.push(exp);
    }

    likeExp(id) {
        let exp = this.getExpById(id);
        let username;
        if ((username = this.getCurrentUser().username) !== "Guest") {
            exp.likes.add(username);
        }
        console.log(exp.likes);
    }

    signupUser(user) {
        let indexes = ["username", "email", "password", "confirmPassword"];
        if (indexes.some( (i) => { 
            if (user[i]===undefined || user[i] === "") 
                return true; 
            else return false}) === true)
        {
            return "Missing user data.";
        }
        if (user.password !== user.confirmPassword) {
            return "Passwords do not match.";
        }
        delete user.confirmPassword;
        if (this.usersMap.has(user.username))
            return "Username already taken.";
        let isEmailAlreadyUsed = false;
        this.usersMap.forEach( (u) => {
            if (u.email === user.email) {
                isEmailAlreadyUsed = true;
            }
        });
        if (isEmailAlreadyUsed === true) {
            return "Email is already used.";
        }
        user.numberLikes = 0;
        user.profileImg = "";
        this.usersMap.set(user.username, user);
        return "";
    }

    signInUser(username, password) {
        let user = this.getUser(username);
        if (user === undefined)
            return null;
        if (user.password === password) {
            //delete user.password;
            if (user.profileImg === "") {
                user.profileImg = profileImg;
            }
            this.setCurrentUser(user);
            return user;
        }
        else 
            return null;
    }

    logoutUser() {
        this.setCurrentUser(guestUser);
        localStorage.removeItem("currentUser");
    }

    getUser(username) {
        return this.usersMap.get(username);
    }

    setCurrentUser(newUser) {
        this.currentUser = newUser;
        this.appSetCurrentUser(this.currentUser);
    }

    getCurrentUser() {
        return this.currentUser;
    }
}

export default DB;