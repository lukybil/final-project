import Rome from "./img/content/colleseum.jpg";
import Madrid from "./img/content/madrid.jpg";
import Vienna from "./img/content/vienna.jpg";
import London from "./img/content/london.jpg";

import profileImg from "./img/default-profile-picture.png"
import {checkExpAndFill} from "./Tile/Tile";

const guestUser = {username: "Guest", email: "none", profileImg: profileImg, numberLikes: 0};
const deletedExp = {
    id: -1,
    name: "",
    img: "",
    country: "",
    city: "", 
    username: "",
    description: ".",
    likes: new Set([""]),
    documentation: "",
    budget: {from: -1, to: -1, notes: ""},
    transportation: "",
    accomodation: "",
    usefulLinks: [],
    tags: [],
    comments: []
};

class User {
    constructor(data) {
        this.data = data;
    }
}

User.prototype.toString = () => {
    
}

class DB {
    colors = ["abdee6", "cbaacb", "ffffb5", "ffccb60", "f3b0c3", "fee1e8", "fed7c3", "ecd5e3", "d4f0f0", "cce2cb", "b6cfb6", "97c1a9", "a2e1db"];

    usersMap = new Map([
        ["kingkong", {username: "kingkong", email: "kingkong@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["godzilla", {username: "godzilla", email: "gzilla@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["charlie", {username: "charlie", email: "ch.arlie@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["boris", {username: "boris", email: "boris.sluklov@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}]
    ]);

    topUsersList = [];

    currentUser = guestUser;

    nextExpId = 2;

    experiences = [
        {
            id: 0,
            name: "Erasmus in Madrid",
            img: Madrid,
            country: "Spain",
            city: "Madrid", 
            username: "kingkong",
            description: "A whole semester spent in the city of liberty in Europe.",
            likes: new Set(["godzilla", "charlie", "boris"]),
            documentation: "ID for EU Citizens",
            budget: {from: 600, to: 800, notes: "Accomodation can be costly."},
            transportation: "Metro is very good",
            accomodation: "Nice",
            usefulLinks: ["spain.com", "madrid.es"],
            tags: ["cultural", "rural", "historical", "business"],
            comments: [
                {username: "kingkong", date: new Date("2021-11-14 21:56:48"), content: "Yo bro, very cool trip bro, wassup btw how ya doin bro, yo cool?"}, 
                {username: "boris", date: new Date("2021-11-15 15:01:03"), content: "Hello broder, gud to see you."}
            ]
        },
        {
            id: 1,
            name: "A trip to Rome",
            img: Rome,
            country: "Italy",
            city: "Rome", 
            username: "godzilla",
            description: "A week long trip to Rome, we saw many cool places, it was amazing.",
            likes: new Set(["godzilla", "charlie", "boris"]),
            documentation: "ID for EU Citizens",
            budget: {from: 600, to: 800, notes: "Accomodation can be costly."},
            transportation: "Metro is available as well as okay buses.",
            accomodation: "Cheap on the outskirst but also dirty surroundings",
            usefulLinks: ["italy.com", "rome.it"],
            tags: ["cultural", "historical"],
            comments: [
                {username: "kingkong", date: new Date("2021-11-17 21:40:32"), content: "Hi so did you like it bra?"}
            ]
        }

    ]

    constructor(appSetCurrentUser) {
        this.appSetCurrentUser = appSetCurrentUser;
    }

    startup() {
        this.updateUserLikesAmount();
        this.updateTopUsersList();
        setInterval(this.updateUserLikesAmount.bind(this), 0.2 * 60 * 1000);
        setInterval(this.updateTopUsersList.bind(this), 0.2 * 60 * 1000); //every 3 minutes, in ms
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
                exp.comments.forEach( (comment) => {
                    comment.date = new Date(comment.date);
                });
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

    isSignedIn() {
        return this.getCurrentUser().username !== "Guest";
    }

    getTopUsers() {
        return this.topUsersList;
    }

    getTopExp(amount) {
        let topExp = [...this.experiences];
        for (let i = 0; i < topExp.length; i++) {
            if (topExp[i].id === -1)
                topExp.splice(i, 1);
        }
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
        if (exp.id === -1)
            return null;
        return exp;
    }

    getFilteredExps(filter) {
        if (filter === null) {
            return;
        }
        let resultExps = [];
        if (filter.keyword !== undefined && filter.keyword !== null) {
            let keyword = filter.keyword.toLowerCase();
            this.experiences.forEach((exp) => {
                for (const key of Object.keys(exp)) {
                    const val = exp[key];
                    if (typeof val === 'string' || val instanceof String) {
                        if (val.toLowerCase().includes(keyword)) {
                            exp.id !== -1 && resultExps.push(exp);
                            break;
                        }
                    }
                }
            });
        }
        else {
            this.experiences.forEach((exp) => {
                if ((exp.name.toLowerCase().includes(filter.name.toLowerCase()) && filter.name !== "") ||
                    (exp.username.toLowerCase().includes(filter.author.toLowerCase()) && filter.author !== "") ||
                    (exp.city.toLowerCase().includes(filter.location.toLowerCase()) && filter.location !== "") ||
                    (exp.country.toLowerCase().includes(filter.location.toLowerCase()) && filter.location !== "") ) 
                {
                    exp.id !== -1 && resultExps.push(exp);
                }
                else {
                    loop1:
                    for (let i = 0; i < filter.tags.length; i++) {
                        const tag = filter.tags[i];
                        for (let j = 0; j < exp.tags.length; j++) {
                            const expTag = exp.tags[j];
                            if (tag === expTag) {
                                exp.id !== -1 && resultExps.push(exp);
                                break loop1;
                            }
                        }
                    }
                }
            });
        }
        return resultExps;
    }

    addExp(exp) {
        checkExpAndFill(exp);
        console.log(exp);
        exp.id = this.nextExpId++;
        if (exp !== undefined)
            this.experiences.push(exp);
    }

    deleteExp(id) {
        let exp = this.experiences[id];
        if (exp.id === id && exp.username === this.currentUser.username) {
            this.experiences[id] = deletedExp;
        }
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

    getRandomColor() {
        let index = Math.floor(Math.random() * this.colors.length);
        return "#"+this.colors[index];
    }

    updateUser(user) {
        this.usersMap.set(user.username, user);
        if (this.getCurrentUser().username = user.username);
            this.setCurrentUser(user);
    }

    getTopExpByUser(username, amount) {
        let userExps = [];
        this.experiences.forEach( (exp) => {
            if (exp.username === username) {
                userExps.push(exp);
            }
        });
        userExps.sort((a, b) => b.likes.size - a.likes.size);
        return userExps;
    }

    dateToFullFormat(date) {
        return date.getDate().toString().padStart(2, '0')  + "-" + (date.getMonth()+1).toString().padStart(2, '0') + "-" + date.getFullYear().toString().padStart(2, '0') + " " + date.getHours().toString().padStart(2, '0') + ":" + date.getMinutes().toString().padStart(2, '0');
    }

    postComment(expId, content) {
        if (!this.isSignedIn())
            return;
        let exp = this.getExpById(expId);
        exp.comments.push({username: this.getCurrentUser().username, date: new Date(), content: content});
    }
}

export default DB;