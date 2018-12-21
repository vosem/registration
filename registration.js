var registrationSubmit = document.getElementsByClassName('register submit')[0];
registrationSubmit.onclick = function(e) {
	e.preventDefault();
	var login = registrationSubmit.parentElement.elements.login.value,
		password = registrationSubmit.parentElement.elements.password.value,
		confirmPassword = registrationSubmit.parentElement.elements.confirmPassword.value;
	if (login == '') {
		alert("Please enter your login.")
	} else if (password != confirmPassword) {
		alert("Entered passwords do not match.\nPlease try again.");
	} else {
		var body = JSON.stringify({
			login: login,
			password: password
		});
		var xhr = new XMLHttpRequest();
		xhr.open("POST", '/submit', true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(body);
		xhr.addEventListener("load", function() { // смотрим ответ сервера
			console.log(JSON.parse(xhr.responseText));
			if (JSON.parse(xhr.responseText) == 'duplicate') {
				alert('Sorry, such login already exists.\nPlease try another one.');
			}else if (JSON.parse(xhr.responseText) == 'unique') {
				alert('Registration succeeded.\nPlease log in.');
			}
		});
	}
}

var loginSubmit = document.getElementsByClassName('login submit')[0];
loginSubmit.onclick = function(e) {
	e.preventDefault();
	var login = loginSubmit.parentElement.elements.login.value,
			password = loginSubmit.parentElement.elements.password.value;
	if (login == '') {
		alert("Please enter your login.")
	} else if (password == '') {
		alert("Please enter your password.");
	} else {
		var body = JSON.stringify({
			login: login,
			password: password
		});
		var xhr = new XMLHttpRequest();
		xhr.open("POST", '/load', true);
		xhr.setRequestHeader("Content-Type", "application/json");
		xhr.send(body);
		xhr.addEventListener("load", function() { // смотрим ответ сервера
			console.log(JSON.parse(xhr.responseText));
			if (JSON.parse(xhr.responseText) == 'denied') {
				alert('Sorry, wrong login or password.\nPlease try again.');
			} else if (JSON.parse(xhr.responseText) == 'permitted') {
				alert('Authorization succeeded.\nWelcome to the celebration!');
			}
		});
	}
}