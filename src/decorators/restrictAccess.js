export default function restrictAccess(db, addSnackbar, callback) {
    if (db.getCurrentUser().username === "Guest") {
        addSnackbar("error", "You have to sign in to use that feature.")
    }
    else {
        callback();
    }
}