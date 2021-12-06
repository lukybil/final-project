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

//Main fake database class used for any data related operarions
class DB {
    /**possible defaultAvatarColors when user creates a new account*/
    colors = ["abdee6", "cbaacb", "ffffb5", "ffccb60", "f3b0c3", "fee1e8", "fed7c3", "ecd5e3", "d4f0f0", "cce2cb", "b6cfb6", "97c1a9", "a2e1db"];

    /** possible tags for experiences */
    static tags = ["cultural", "rural", "historical", "business", "environmental", "eco-tourism"];

    //all users stored in a map
    usersMap = new Map([
        ["kingkong", {username: "kingkong", email: "kingkong@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["godzilla", {username: "godzilla", email: "gzilla@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["charlie", {username: "charlie", email: "ch.arlie@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}],
        ["boris", {username: "boris", email: "boris.sluklov@gmail.comm", password: "p", defaultAvatarColor: this.getRandomColor(), profileImg: "", numberLikes: 0}]
    ]);

    //top users based on aggregate amount of likes among their experiecnes
    topUsersList = [];

    //currently logged in user
    currentUser = guestUser;

    //next experience it to be added in the experiences array
    nextExpId = 2;

    //storage array for experiences, ids match the indexes, so the search speed i O(1)
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

    //collections storage
    collections = [
        {
            id: 0,
            name: "",
            img: "",
            username: "",
            description: "",
            experiences: [this.experiences[0]]
        }
    ]

    //appSetCurrentUser is a function in the App Component, calling this function notifies the whole app of user change
    constructor(appSetCurrentUser) {
        this.appSetCurrentUser = appSetCurrentUser;
    }

    /**sets timers for recalculating users likes amount and updating the top users table*/
    startup() {
        this.updateUserLikesAmount();
        this.updateTopUsersList();
        setInterval(this.updateUserLikesAmount.bind(this), 0.2 * 60 * 1000);
        setInterval(this.updateTopUsersList.bind(this), 0.2 * 60 * 1000); //every 3 minutes, in ms
    }

    setAppSetCurrentUser(appSetCurrentUser) {
        this.appSetCurrentUser = appSetCurrentUser;
    }

    /**saves all data to local storage*/
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

    /**loads from local storage*/
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

    /**updates top users list, triggered by the timer in function startup()*/
    updateTopUsersList() {
        this.topUsersList = [];
        this.usersMap.forEach( (user) => {
            this.topUsersList.push(user);
        });
        this.topUsersList.sort((a, b) => b.numberLikes - a.numberLikes);
        this.topUsersList = this.topUsersList.slice(0, 10);
    }

    /**updates users likes amount, triggered by the timer in function startup()*/
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

    /**get a by amount specified number of experiences with the most likes */
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

    /**used by search, returns experiences array based on filter parameters*/
    getFilteredExps(filter) {
        if (filter === null) {
            return;
        }
        let resultExps = [];
        if (filter.keyword !== undefined && filter.keyword !== null) {
            //a simple filter, checks every string attribute of each experience for a match of the keyword
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
            //the advanced filter, the resulting exps match all the set filter attributes
            let matchCounter = 0;
            let fieldsSet = 0;
            filter.name !== "" && fieldsSet++;
            filter.author !== "" && fieldsSet++;
            filter.location !== "" && fieldsSet++;
            filter.tags.length !== 0 && fieldsSet++;

            this.experiences.forEach((exp) => {
                matchCounter = 0;
                if (exp.name.toLowerCase().includes(filter.name.toLowerCase()) && filter.name !== "")
                    matchCounter++;
                if (exp.username.toLowerCase().includes(filter.author.toLowerCase()) && filter.author !== "")
                    matchCounter++;
                if ((exp.city.toLowerCase().includes(filter.location.toLowerCase()) && filter.location !== "") || 
                    (exp.country.toLowerCase().includes(filter.location.toLowerCase()) && filter.location !== ""))
                    matchCounter++;
                //check for tags match
                loop1:
                for (let i = 0; i < filter.tags.length; i++) {
                    const tag = filter.tags[i];
                    for (let j = 0; j < exp.tags.length; j++) {
                        const expTag = exp.tags[j];
                        if (tag === expTag) {
                            matchCounter++;
                            break loop1;
                        }
                    }
                }
                exp.id !== -1 && matchCounter === fieldsSet && resultExps.push(exp);
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

    /**signs up a new user*/
    signupUser(user) {
        let indexes = ["username", "email", "password", "confirmPassword"];
        //checks for user object missing data, array function some returns true and breaks only if true is returned inside the function
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
        user.defaultAvatarColor = this.getRandomColor();
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

    /** gets a random color from the colors array */
    getRandomColor() {
        let index = Math.floor(Math.random() * this.colors.length);
        return "#"+this.colors[index];
    }

    updateUser(user) {
        this.usersMap.set(user.username, user);
        if (this.getCurrentUser().username === user.username);
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
        userExps = userExps.slice(0, amount);
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

    getCollection(collectionId) {
        return this.collections[collectionId].id === collectionId ? this.collections[collectionId] : null;
    }

    addCollection(collection) {
        if (collection.username !== this.getCurrentUser().username)
            return;
        let collectionTemplate = {
            name: "",
            img: "",
            username: "",
            description: "",
            experiences: []
        };
        collectionTemplate = {...collection};
        collection.id = this.collections.length;
        this.collections.push(collectionTemplate);
    }

    addToCollection(expId, collectionId) {
        let exp = this.getExpById(expId);
        let collection = this.collections[collectionId];
        if (exp.username === collectionId && exp.username === this.getCurrentUser().username)
            collection.experiences.push(exp);
    }

    getCollectionsByUser(username, amount) {
        let userCollections = [];
        this.collections.forEach( (exp) => {
            if (exp.username === username) {
                userCollections.push(exp);
            }
        });
        //userCollections.sort((a, b) => b.likes.size - a.likes.size);
        if (amount !== -1)
            userCollections = userCollections.slice(0, amount);
        return userCollections;
    }
}

export default DB;

/*

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

*/