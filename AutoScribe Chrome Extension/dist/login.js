const loginbtn = document.getElementById("loginbtn");
loginbtn.addEventListener( 'click', async () => {

	
	const username = document.getElementById("username").value;
	const password = document.getElementById("password").value;
	console.log("called...")
	var myHeaders = new Headers();
	myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
	myHeaders.append("Cookie", "AUTH_SESSION_ID_LEGACY=3b453630-ff91-4f85-97f7-b3ac0c3a8ba6");
	
	var urlencoded = new URLSearchParams();
	urlencoded.append("client_id", "ehrbase-client");
	urlencoded.append("username", username);
	urlencoded.append("password", password);
	urlencoded.append("grant_type", "password");
	urlencoded.append("scope", "openid");
	var requestOptions = {
	  method: 'POST',
	  headers: myHeaders,
	  body: urlencoded,
	  redirect: 'follow'
	};
	console.log("username...", username)
	console.log("password...", password)
	if((username && username.length > 1) && (password && password.length >1)){
	//document.getElementById("loginDiv").innerHTML = ' <span id="loader" style="margin-left: 38%;font-size: 4.8rem;"><i class="fas fa-spinner fa-pulse"></i></span> ';
		fetch("http://10.131.85.60:8180/realms/ehrbase/protocol/openid-connect/token", requestOptions)
		.then(response => response.json())
		.then(data =>{
			console.log(data)
			const myArray = Object.values(data);
			console.log(myArray)
			if(myArray.length>=2 && myArray[1] != "Invalid user credentials"){
				console.log("true....", myArray[0])

				var myHeaders = new Headers();
				myHeaders.append("Authorization", "Bearer "+myArray[0]);

				var requestOptions = {
				method: 'GET',
				headers: myHeaders,
				redirect: 'follow'
				};
				var user;
				fetch("http://10.131.85.60:8180/realms/ehrbase/protocol/openid-connect/userinfo", requestOptions)
				.then(response => response.text())
				.then(result => {
					const myArray = JSON.parse(result)
					console.log(myArray)
					console.log(myArray["name"])
					localStorage.setItem("user", myArray["name"])
				})
				.catch(error => console.log('error', error));
				setTimeout(window.location.replace("recording.html"), 2000);
				//window.location.replace("recording.html");
			} else {
				document.getElementById("loginError").style.display="block";
				setTimeout(() => {
					document.getElementById("loginError").style.display="none";
				}, 3000);
			}
		});
	} else {
	document.getElementById("loginError").style.display="block";
	setTimeout(() => {
		document.getElementById("loginError").style.display="none";
	}, 3000);
	
}
	  
} );




