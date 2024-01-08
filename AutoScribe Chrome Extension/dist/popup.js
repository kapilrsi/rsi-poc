const record = document.getElementById("record");
const stopRecord = document.getElementById("stopRecord");

const addnew = document.getElementById("addNew");
const logout = document.getElementById("logout");
const downloadClinicalPDF = document.getElementById("downloadClinicalPDF");
const downloadSoapPDF = document.getElementById("downloadSoapPDF");
const downloadDetailedPDF =  document.getElementById("downloadDetailedPDF");
const uploadBtn = document.getElementById("uploadBtn");
const b1 =  document.getElementById("b1");
const b2 =  document.getElementById("b2");
const b3 =  document.getElementById("b3");
const typeEle = document.getElementById("type");
let audioLength = 0;
let start;
let type = document.getElementById("type").value;
document.getElementById("topIcons").style.display = "block";
var xhr = new XMLHttpRequest();
document.getElementById("userP").innerText = "Dr. "+localStorage.getItem("user");
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { handlerFunction(stream) })

async function handlerFunction(stream) {
	rec = new MediaRecorder(stream);
	rec.ondataavailable = async e => {
		//type = document.getElementById("type").value;
		audioChunks.push(e.data);
		if (rec.state == "inactive") {
			document.getElementById("loader").style.display = "block";
			let blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
			const formData = new FormData();
			formData.append("audiofile", blob);
			let jsonStr;
			if(type == 1){
				jsonStr = '{"Type":"General","Reported_Issues":""}';
			}
			else if(type == 2){
				jsonStr = '{"Type":"Ophthalmology","Reported_Issues":""}';
			}
			console.log("type = ", type);
			var audioElement = document.getElementById("player1");
			audioElement.src = URL.createObjectURL(blob);
			audioElement.load();
			audioElement.onloadeddata = function(){
				var audDuration = audioElement.duration;
				console.log("audioElement.duration = " + audioLength);
				jsonStr = { ...JSON.parse(jsonStr), audio_length: audioLength }; 
				console.log("ros JSON = ",jsonStr)
				const blobFile = new Blob( [ JSON.stringify(jsonStr) ], {
					type: "application/json;charset=utf-8"
				});
				console.log("calling api now...............")

				formData.append("jsonfile", blobFile);
				populateData(formData);
			} 
		}
	}
}
async function populateData(formData){
	await fetch("http://10.131.85.58:5053/extract_summary", {
		method: "POST",
		body: formData,
	}).then(response => response.json())
		.then(data => {
			if (typeof (data) == 'string') {
				console.log("Error --->", reply.data);
				document.getElementById("recBlk").style.display = "none";
				document.getElementById("text").innerHTML='<div class="valid-labelOriginal">Clinical Notes</div>';
				document.getElementById("topIcons").style.display = "block";
			}
			else {
				const myArray = Object.values(data);
				if (typeof (myArray[0]) == 'string') {
					document.getElementById("recBlk").style.display = "none";
					document.getElementById("text").innerHTML='<div class="valid-labelOriginal">Clinical Notes</div>';
					document.getElementById("topIcons").style.display = "block";
				} else {
					let json = myArray[2];
					let htmlDetailedReport = "";
					let htmlTableD =""
					for (const [key, value] of Object.entries(json)) {
						htmlTableD = htmlTableD + "<tr><td>&nbsp;</td></tr><tr><td><strong>"+key+": </strong><br/>"+splitText(value)+"</td></tr>";
						htmlDetailedReport = htmlDetailedReport + '<div class="valid-label">'+key+':</div><div class="valid-content">'+splitText(value)+'</div>';
					}
					
					json = myArray[1];
					let htmlClinicalNotes = "";
					let htmlTableCN =""
					for (const [key, value] of Object.entries(json)) {
						htmlClinicalNotes = htmlClinicalNotes + '<div class="valid-label">'+key+':</div><div class="valid-content">'+splitText(value)+'</div>';
						htmlTableCN = htmlTableCN + "<tr><td>&nbsp;</td></tr><tr><td><strong>"+key+": </strong><br/>"+splitText(value)+"</td></tr>";
					}

					let assessment = myArray[2].Assessment;
					let objective = myArray[2].Objective;
					let plan = myArray[2].Plan;
					let subjective = myArray[2].Subjective;
					let ICDCODES = myArray[2]["ICD Codes"];
					let CPTCODES = myArray[2]["CPT Codes"];
					assessment = assessment + "<br/><br/>ICD CODES<br/>"+splitText(ICDCODES)+"<br/><br/>CPT CODES<br/>"+splitText(CPTCODES);
					

					if(myArray[0]){
						json = myArray[0];
						plan = plan + "<br/><br/><strong>Instructions:</strong>";
						let htmlPatientInstructions = "";
						let htmlPatientInstructionsDiv = "";
						htmlPatientInstructions = "<tr><td>&nbsp;</td></tr><tr><td><strong>Instructions:</strong><br/>";
						htmlPatientInstructionsDiv = htmlPatientInstructionsDiv  
							+ '<div class="valid-label">Instructions:</div><div class="valid-content">';
						for (const [key, value] of Object.entries(json)) {
							console.log(value);
							htmlPatientInstructions =
							htmlPatientInstructions +
							splitTextPI("<li>"+value+"</li>");                        
							plan = plan +splitTextPI("<li>"+value+"</li>"); 

							htmlPatientInstructionsDiv = htmlPatientInstructionsDiv  
							+splitTextPI("<li>"+value+"</li>");
						}
						htmlPatientInstructionsDiv = htmlPatientInstructionsDiv  
							+ '</div>';
						htmlPatientInstructions = htmlPatientInstructions +"</td></tr>";
						htmlClinicalNotes = htmlClinicalNotes+htmlPatientInstructionsDiv;
						htmlTableCN =  htmlTableCN +htmlPatientInstructions;
						htmlDetailedReport = htmlDetailedReport+ htmlPatientInstructionsDiv;
						htmlTableD = htmlTableD +htmlPatientInstructions;
					}
					document.getElementById("detailedContent").innerHTML = htmlDetailedReport;
					document.getElementById("clinicalNotesContent").innerHTML = htmlClinicalNotes;
					document.getElementById("response1").innerHTML = subjective;
					document.getElementById("response2").innerHTML = objective;
					document.getElementById("response3").innerHTML = assessment;
					document.getElementById("response4").innerHTML = plan;
					document.getElementById("loader").style.display = "none";
					document.getElementById("recBlk").style.display = "none";
					document.getElementById("tabContainer").style.display = "block";
					document.getElementById("text").style.display="none";
					document.getElementById("topIcons").style.display = "block";
				
					let html = document.getElementById("pdfText").innerHTML;
					html = html.replace("replacedoa", new Date().toDateString());
					html = html.replace("replacedname", "Dr. "+localStorage.getItem("user"));
					html = html.replace("sText", subjective);
					html = html.replace("pText", plan);
					html = html.replace("oText", objective);
					html = html.replace("aText", assessment);
					document.getElementById("pdfText").innerHTML = html;
					
					htmlTableCN = "<TABLE WIDTH='90%' ALIGN='CENTER' VALIGN='TOP' STYLE='FONT-FAMILY:ARIAL;'><TR><TD><TABLE WIDTH='100%'><TR><TD><H3><STRONG>Clinical Notes</STRONG></H3></TD></TR><TR><TD><STRONG>Date of Encounter:</STRONG>"+new Date().toDateString()+"</TD></TR><TR><TD><STRONG>Provider:</STRONG>"+ "Dr. "+localStorage.getItem("user")+"</TD></TR>"+htmlTableCN;
					htmlTableCN = htmlTableCN+ "</TD></TR></TABLE></TD></TR></TABLE>";
					console.log("htmlTableCN == ",htmlTableCN);
					document.getElementById("newFormatText").innerHTML = htmlTableCN;

					htmlTableD = "<TABLE WIDTH='90%' ALIGN='CENTER' VALIGN='TOP' STYLE='FONT-FAMILY:ARIAL;'><TR><TD><TABLE WIDTH='100%'><TR><TD><H3><STRONG>Detailed Report</STRONG></H3></TD></TR><TR><TD><STRONG>Date of Encounter:</STRONG>"+new Date().toDateString()+"</TD></TR><TR><TD><STRONG>Provider:</STRONG>"+ "Dr. "+localStorage.getItem("user")+"</TD></TR>"+htmlTableD;
					htmlTableD = htmlTableD+ "</TD></TR></TABLE></TD></TR></TABLE>";	
					console.log("htmlTableD == ",htmlTableD);					
					document.getElementById("newFormatTextD").innerHTML = htmlTableD;
				}
			}
		});
}
function splitText(text){
	console.log(typeof(text))
	if(text){
		text = String(text);
		console.log("text = ", text);
		text = text.replaceAll(',-','<br/>')
		text = text.replaceAll('- ','<br/>')
		console.log("text after = ", text);
	}
	return text;
}
function splitTextPI(text){
	console.log(typeof(text))
	if(text){
		text = String(text);
		console.log("text = ", text);
		text = text.replaceAll(',-','')
		text = text.replaceAll('- ','')
		console.log("text after = ", text);
	}
	return text;
}
var result;
function callback() {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		if (xhr.status === 200) {
			result = xhr.responseText;
			alert(result);
		}
	}
};
function sendData(data) { }
record.addEventListener('click', () => {
	start = Date.now();
	// record.onclick = e => {
	document.getElementById("text").innerHTML = ' <span>Click</span>&nbsp;<i class="fa fa-microphone" aria-hidden="true" ></i><span>&nbsp;to end the consultation</span>'
	// record.disabled = true;
	record.style.display = "none";
	stopRecord.style.display = "block";
	//record.style.backgroundColor = "blue"
	stopRecord.disabled = false;
	audioChunks = [];
	rec.start();
});

stopRecord.addEventListener('click', () => {
	let end = Date.now();
	audioLength = end - start
	audioLength = audioLength/1000;
	console.log("audioLength = ",audioLength);
	type = document.getElementById("type").value
	record.style.display = "none";
	stopRecord.style.display = "none";
	stopRecord.disabled = true;
	record.disabled = false;
	document.getElementById("text").innerHTML = 'Please wait, the AI/ML engine is generating clinical notes....'
	document.getElementById("recBlk").innerHTML = ' <span id="loader" style="margin-left: 38%;font-size: 4.8rem;"><i class="fas fa-spinner fa-pulse"></i></span> ';

	//record.style.backgroundColor = "red"
	rec.stop();
});


addNew.addEventListener('click', () => {
	//generatePDF();
	window.location.replace("recording.html");
});
logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.replace("index.html");
});

downloadClinicalPDF.addEventListener('click', async () => {
		console.log("downloadClinicalPDF click called")
		const formData = new FormData();
        formData.append("html", document.getElementById("newFormatText").innerHTML);
		await fetch("http://10.131.85.60:2100/generate", {
				method: "POST",
				body: formData,
			}).then(response => response.json())
				.then(data => {
					const array = Object.values(data);
					console.log(array[1]);
					let url = array[1];
					let a = document.createElement("a");
					a.target = "_blank";
					a.href = String(url);
					a.click();
		});
});

downloadSoapPDF.addEventListener('click', async () => {
		
		const formData = new FormData();
        formData.append("html", document.getElementById("pdfText").innerHTML);
		await fetch("http://10.131.85.60:2100/generate", {
				method: "POST",
				body: formData,
			}).then(response => response.json())
				.then(data => {
					const array = Object.values(data);
					console.log(array[1]);
					let url = array[1];
					let a = document.createElement("a");
					a.target = "_blank";
					a.href = String(url);
					a.click();
		});
        
});

downloadDetailedPDF.addEventListener('click', async () => {
		
	const formData = new FormData();
	formData.append("html", document.getElementById("newFormatTextD").innerHTML);
	await fetch("http://10.131.85.60:2100/generate", {
			method: "POST",
			body: formData,
		}).then(response => response.json())
			.then(data => {
				const array = Object.values(data);
				console.log(array[1]);
				let url = array[1];
				let a = document.createElement("a");
				a.target = "_blank";
				a.href = String(url);
				a.click();
	});
	
});


b1.addEventListener('click', async () => {
	console.log(b1.style.backgroundColor);
	b1.style.backgroundColor ="#62adbd";
	b2.style.backgroundColor ="#7e9195";
	b3.style.backgroundColor ="#7e9195";
});
b2.addEventListener('click', async () => {
	console.log(b2.style.backgroundColor);
	b1.style.backgroundColor ="#7e9195";
	b2.style.backgroundColor ="#62adbd";
	b3.style.backgroundColor ="#7e9195";
});
b3.addEventListener('click', async () => {
	console.log(b3.style.backgroundColor);
	b1.style.backgroundColor ="#7e9195";
	b2.style.backgroundColor ="#7e9195";
	b3.style.backgroundColor ="#62adbd";
});

uploadBtn.addEventListener('click', async () => {
	let input = document.createElement('input');
	input.type = 'file';
	input.onchange = async _ => {
		// you can use this method to get file and perform respective operations
				let files =   Array.from(input.files);
				console.log(files);
				var file = input.files[0];
				var reader = new FileReader();
				reader.readAsText(file);
				const blob = new Blob([file], { type: file.type});
				const formData = new FormData();
				let jsonStr;
				type = document.getElementById("type").value;
				if(type == 1){
					jsonStr = '{"Type":"General","Reported_Issues":""}';
				}
				else if(type == 2){
					jsonStr = '{"Type":"Ophthalmology","Reported_Issues":""}';
				}
				formData.append("audiofile", blob);
				
				var audioElement = document.getElementById("player1");
				audioElement.src = URL.createObjectURL(blob);
				audioElement.load();
				audioElement.onloadeddata = function(){
					var audDuration = audioElement.duration;
					console.log("audioElement.duration = " + audDuration);
					console.log(jsonStr)
					jsonStr = { ...JSON.parse(jsonStr), audio_length: audDuration }; 
					console.log("ros JSON = ",jsonStr)
					const blobFile = new Blob( [ JSON.stringify(jsonStr) ], {
						type: "application/json;charset=utf-8"
					});
				console.log("calling api now...............")
				formData.append("jsonfile", blobFile);
				document.getElementById("text").innerHTML = 'Please wait, the AI/ML engine is generating clinical notes....'
				document.getElementById("recBlk").innerHTML = ' <span id="loader" style="margin-left: 38%;font-size: 4.8rem;"><i class="fas fa-spinner fa-pulse"></i></span> ';
				populateData(formData);
				} 
			};
	input.click();
});

typeEle.addEventListener('change', async () => {
	type = typeEle.value;
});
