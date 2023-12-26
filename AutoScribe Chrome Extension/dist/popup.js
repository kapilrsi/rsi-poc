const record = document.getElementById("record");
const stopRecord = document.getElementById("stopRecord");
const generateSoapNotes = document.getElementById("generateSoapNotes");
const generateDetailedNotes = document.getElementById("generateDetailedNotes");
const addnew = document.getElementById("addNew");
const logout = document.getElementById("logout");
const downloadClinicalPDF = document.getElementById("downloadClinicalPDF");
const downloadSoapPDF = document.getElementById("downloadSoapPDF");
let type = document.getElementById("type").value;
document.getElementById("topIcons").style.display = "block";
var xhr = new XMLHttpRequest();
document.getElementById("userP").innerText = "Dr. "+localStorage.getItem("user");
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { handlerFunction(stream) })

async function handlerFunction(stream) {
	
	
	rec = new MediaRecorder(stream);
	rec.ondataavailable = async e => {
		audioChunks.push(e.data);
		if (rec.state == "inactive") {
			document.getElementById("loader").style.display = "block";
			document.getElementById("soap").style.display = "none";
			let blob = new Blob(audioChunks, { type: "audio/ogg; codecs=opus" });
			const formData = new FormData();
			formData.append("audiofile", blob);
			console.log("type = ", type);
			let jsonStr;
			if(type == 1){
				jsonStr = '{"Type":"General","Reported_Issues":""}';
			}
			else if(type == 2){
				jsonStr = '{"Type":"Ophthalmology","Reported_Issues":""}';
			}
			const blobFile = new Blob([jsonStr], { type: "application/json;charset=utf-8" });
			formData.append("jsonfile", blobFile);

			await fetch("http://10.131.85.60:5053/extract_summary", {
				method: "POST",
				body: formData,
			}).then(response => response.json())
				.then(data => {
					if (typeof (data) == 'string') {
						console.log("Error --->", reply.data);
						document.getElementById("recBlk").style.display = "none";
						document.getElementById("soap").innerHTML = "<p style='color: red;'>The AI engine was not able to decipher the conversation.<br/> Please Re-record.</p><a href='recording.html'>Re-Record</a>"
						document.getElementById("soap").style.display = "block";
						document.getElementById("text").innerHTML='<div class="valid-labelOriginal">Clinical Notes</div>';
						// document.getElementById("adNew").style.display = "inline";
						document.getElementById("topIcons").style.display = "block";
					}
					else {
						const myArray = Object.values(data);
						if (typeof (myArray[0]) == 'string') {
							document.getElementById("recBlk").style.display = "none";
							document.getElementById("soap").innerHTML = "<p style='color: red;'>The AI engine was not able to decipher the conversation.<br/> Please Re-record.</p><a href='recording.html'>Re-Record</a>"
							document.getElementById("soap").style.display = "block";
							document.getElementById("text").innerHTML='<div class="valid-labelOriginal">Clinical Notes</div>';
							// document.getElementById("adNew").style.display = "inline";
							document.getElementById("topIcons").style.display = "block";
							//generatePDF();
						} else {

							let assessment = myArray[1].Assessment;
							let objective = myArray[1].Objective;
							let plan = myArray[1].Plan;
							let subjective = myArray[1].Subjective;
							let ICDCODES = myArray[1]["ICD CODES"];
							assessment = assessment + "<br/><br/>"+splitText(ICDCODES);
							let newassessment = myArray[0].Assessment;
							let appointments = myArray[0].Appointments;
							let chiefcomplaint = myArray[0]["Chief complaint"];
							let history = myArray[0]["History of present illness"];
							let newplan = myArray[0].Plan;
							let prescription = myArray[0].Prescription;
							let vitals = myArray[0].Vitals;
							let ICDCODESDetails = myArray[0]["ICD CODES"];
							document.getElementById("response1").innerHTML = subjective;
							document.getElementById("response2").innerHTML = objective;
							document.getElementById("response3").innerHTML = assessment;
							document.getElementById("response4").innerHTML = plan;
							document.getElementById("response5").innerHTML = splitText(appointments);
							document.getElementById("response6").innerHTML = splitText(newassessment);
							document.getElementById("response7").innerHTML = splitText(chiefcomplaint);
							document.getElementById("response8").innerHTML = splitText(history);
							document.getElementById("response9").innerHTML = splitText(newplan);
							document.getElementById("response10").innerHTML = splitText(prescription);
							document.getElementById("response11").innerHTML = splitText(vitals);
							document.getElementById("response12").innerHTML = splitText(ICDCODESDetails);
							document.getElementById("loader").style.display = "none";
							document.getElementById("recBlk").style.display = "none";
							//document.getElementById("soap").style.display="block";
							document.getElementById("detailed").style.display = "block";
							document.getElementById("text").innerHTML='<div class="valid-labelOriginal">Clinical Notes</div>';
							// document.getElementById("adNew").style.display = "inline";
							document.getElementById("topIcons").style.display = "block";
						
							let html = document.getElementById("pdfText").innerHTML;
							html = html.replace("replacedoa", new Date().toDateString());
							html = html.replace("replacedname", "Dr. "+localStorage.getItem("user"));
							html = html.replace("sText", subjective);
							html = html.replace("pText", plan);
							html = html.replace("oText", objective);
							html = html.replace("aText", assessment);

							document.getElementById("pdfText").innerHTML = html;

							let newTemplatehtml = document.getElementById("newFormatText").innerHTML;
							newTemplatehtml = newTemplatehtml.replace("replacedoa", new Date().toDateString());
							newTemplatehtml = newTemplatehtml.replace("replacedname", "Dr. "+localStorage.getItem("user"));
							newTemplatehtml = newTemplatehtml.replace(
								"appointmentsTxt",
								splitText(appointments),
							);
							newTemplatehtml = newTemplatehtml.replace(
								"assessmentTxt",
								splitText(newassessment),
							);
							newTemplatehtml = newTemplatehtml.replace("chiefcomplaintTxt",splitText(chiefcomplaint),
							);
							newTemplatehtml = newTemplatehtml.replace("historyTxt", splitText(history));
							newTemplatehtml = newTemplatehtml.replace("planTxt", splitText(newplan));
							newTemplatehtml = newTemplatehtml.replace("icdCodesTxt", splitText(ICDCODESDetails));
							newTemplatehtml = newTemplatehtml.replace(
								"prescriptionTxt",
								splitText(prescription),
							);
							newTemplatehtml = newTemplatehtml.replace("vitalsTxt", splitText(vitals));
							document.getElementById("newFormatText").innerHTML = newTemplatehtml;
						}
					}
				});
			//console.log(await response.json());
			//sendData(blob)
		}
	}
}
function splitText(text){
	console.log(typeof(text))
	if(text){
		text = String(text);
		console.log("text = ", text);
		text = text.replaceAll(',-','<br/>')
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
	//stopRecord.onclick = e => {
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

generateSoapNotes.addEventListener('click', () => {
	document.getElementById("soap").style.display = "block";
	document.getElementById("detailed").style.display = "none";
});

generateDetailedNotes.addEventListener('click', () => {
	document.getElementById("soap").style.display = "none";
	document.getElementById("detailed").style.display = "block";
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




