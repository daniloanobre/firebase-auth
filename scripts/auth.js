// add admin cloud function
const adminForm = document.querySelector(".admin-actions");
adminForm.addEventListener("submit", e => {
  e.preventDefault();

  const adminEmail = document.querySelector("#admin-email").value;
  console.log(adminEmail);

  const addAdminRole = functions.httpsCallable("addAdminRole");
  addAdminRole({ email: adminEmail })
    .then(result => {
      adminForm.querySelector(".error").innerHTML = result.data.error;
      console.log(result);
    })
    .catch(err => {
      // Getting the Error details.
      var code = err.code;
      var message = err.message;
      var details = err.details;
      console.log(code, message, details);
    });
});

// listen for auth status change
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      console.log("Is the user admin? ", user.admin ? "true" : "false");
      setupUI(user);
    });
    db.collection("guides").onSnapshot(
      snapshot => {
        setupGuides(snapshot.docs);
      },
      err => console.log(err.message)
    );
  } else {
    setupUI();
    setupGuides([]);
  }
});

// create new guide
const createGuideForm = document.querySelector("#create-form");
createGuideForm.addEventListener("submit", e => {
  e.preventDefault();

  const title = createGuideForm["title"].value;
  const content = createGuideForm["content"].value;

  db.collection("guides")
    .add({ title, content })
    .then(ref => {
      // close the create guide modal and reset the form
      const modal = document.querySelector("#modal-create");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch(err => console.log(err.message));
});

// sign up
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", e => {
  e.preventDefault();

  // get user info
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  const bio = signupForm["signup-bio"].value;

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      return db
        .collection("users")
        .doc(cred.user.uid)
        .set({ bio });
    })
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
      signupForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      signupForm.querySelector(".error").innerHTML = err.message;
    });
});

// logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", e => {
  e.preventDefault();
  auth.signOut();
});

// login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", e => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then(cred => {
      // close the login modal and reset the form
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
      loginForm.querySelector(".error").innerHTML = "";
    })
    .catch(err => {
      loginForm.querySelector(".error").innerHTML = err.message;
    });
});
