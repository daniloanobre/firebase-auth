// listen for auth status change
auth.onAuthStateChanged(user => {
  setupUI(user);
  if (user) {
    db.collection("guides").onSnapshot(
      snapshot => {
        setupGuides(snapshot.docs);
      },
      err => console.log(err.message)
    );
  } else {
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

  // sign up the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(cred => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch(err => console.err(err));
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
    })
    .catch(err => console.err(err));
});
