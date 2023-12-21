<div class="modal fade custome-modal" id="review-edit" tabindex="-1" aria-hidden="true">
    <BasicQuestionsAnswers/>
</div>
<style>
.c {
position: absolute;
left: 85%;
top:2%;
} 

</style>

<script lang="ts">
let axiosConfig = {
    headers: {
        "Content-Type": "multipart/form-data",
        "Access-Control-Allow-Origin": "*"
        // ,
        // "x-functions-key":"Ptl8QOkwMtiNPe0RvlhUv81r568nT4K6Y1QILfTl6DFxAzFu3bi17g=="
    },
};
export let loading;
let recordingStatus = false;
import { onMount } from "svelte";
import { store } from "./localStore";
import { extractSummary } from "../fhir";
import BasicQuestionsAnswers from "./BasicQuestionsAnswers.svelte";
let openehr, ehrscape, username, password, ehrId, patientName, dob, assessment,objective, jsonStr, rosText , plan,subjective, jsonResponse ;
let media = [];
let mediaRecorder = null;
let json1, json2, json3, json4, finalJson, newassessment, appointments, chiefcomplaint, history, newplan, prescription, vitals;
onMount(async () => {
   await ({
        openehr = "",
        ehrscape = "",
        username = "",
        password = "",
        ehrId = "",
        patientName = "",
        dob = "",
        assessment = "",
        objective = "",
        plan = "",
        subjective  = "",
        jsonResponse = "",
        rosText = "",
        jsonStr = "",
        newassessment = "",
        appointments= "",
        chiefcomplaint= "",
        history= "",
        newplan= "",
        prescription= "",
        vitals= "",
    } = JSON.parse($store) ?? {});
    console.log("Recording --->",JSON.parse($store));
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
    });
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = (e) => {
        media.push(e.data);
    };
    mediaRecorder.onstart = async function () {

    };
    mediaRecorder.onstop = async function () {
        loading = true;
        //const audio = document.querySelector("audio");
        const blob = new Blob(media, { type: "audio/ogg; codecs=opus" });
        const formData = new FormData();
        formData.append("audiofile", blob);
      
        ///var file = new File([blob], ")temp.ogg", {type:"audio/ogg; codecs=opus"});
        document.getElementById("player1").src = URL.createObjectURL(blob);
        document.getElementById("player1").load();
        document.getElementById("player2").src = URL.createObjectURL(blob);
        document.getElementById("player2").load();
        console.log("Recording jsonStr --->",jsonStr)
        const blobFile = new Blob( [ jsonStr ], {
            type: "application/json;charset=utf-8"
        });
        formData.append("jsonfile", blobFile);
        const reply = await extractSummary.post("extract_summary",
            formData
            // ,
            // axiosConfig
        );
        
        if(typeof(reply.data) == 'string'){
            console.log("Error --->", reply.data);
            document.getElementById("errorDiv").style.display = "block";
           // document.getElementById("errorDivNoConsent").style.display = "none";
            document.getElementById("loadingDiv").style.display="none";
            document.getElementById("successDiv").style.display="none";
        }
        else{
            const myArray = Object.values(reply.data);
            //document.getElementById("btnDoNothing").style.display="none";
            console.log("myArray --->",myArray)
            if(typeof(myArray[0]) == 'string'){
                console.log("Error --->", reply.data);
                // if(myArray[0].includes("consent")){
                //     // document.getElementById("errorDivNoConsent").style.display = "block";
                //     document.getElementById("replaceTxt").innerHTML = myArray[0];
                // }
                // else{
                    // document.getElementById("errorDivNoConsent").style.display = "none";
                    document.getElementById("errorDiv").style.display = "block";
                // }
               
                document.getElementById("loadingDiv").style.display="none";
                document.getElementById("successDiv").style.display="none";
            }
            else{
                console.log(myArray[0]);
                newassessment = myArray[0].Assessment;
                appointments= myArray[0].Appointments;
                chiefcomplaint= myArray[0]["Chief complaint"];
                history= myArray[0]["History of present illness"];
                newplan= myArray[0].Plan;
                prescription= myArray[0].Prescription;
                vitals= myArray[0].Vitals;
                let ICDCODESDetails = myArray[0]["ICD CODES"];
                newassessment =  splitText(newassessment);
                appointments =  splitText(appointments);
                chiefcomplaint =  splitText(chiefcomplaint);
                history =  splitText(history);
                newplan =  splitText(newplan);
                prescription =  splitText(prescription);
                vitals =  splitText(vitals);
                newplan = newplan +"::::"+splitText(ICDCODESDetails);
                let assessment = myArray[1].Assessment;
                let objective = myArray[1].Objective;
                let plan = myArray[1].Plan;
                let subjective = myArray[1].Subjective;
                let ICDCODES = myArray[1]["ICD CODES"];
                let jsonResponse = reply.data;
                assessment = assessment + "\n\n"+splitTextForSOAP(ICDCODES);
                console.log("username --->", username);
                console.log("assessment --->", assessment);
                console.log("objective --->", objective);
                console.log("plan --->", plan);
                console.log("subjective --->", subjective);
                var formEncounter = document.getElementById("formEncounter");
                var formCondition = document.getElementById("formCondition");
                var formClinicalImpression = document.getElementById("formClinicalImpression");
                var formRequestOrchestration = document.getElementById("formRequestOrchestration");
                formEncounter.import({
                    "diagnosis[0].condition[0].concept.text": subjective
                });
                formCondition.import({
                    "code.text": assessment
                });
                formClinicalImpression.import({
                    "description": objective
                });
                formRequestOrchestration.import({
                    "contained[0].medication.concept.text": plan
                });
                document.getElementById("btn1").click();
                document.getElementById("btn2").click();
                document.getElementById("btn3").click();
                document.getElementById("btn4").click();
                //createFinalJson();
                let t = setTimeout(createFinalJson, 1000);
                // jsonResponse = finalJson;
                console.log("jsonResponse --->", jsonResponse);
                console.log("t --->", t);
                    store.setLocal(
                        JSON.stringify({
                            openehr,
                            ehrscape,
                            username,
                            password,
                            ehrId,
                            patientName,
                            dob,
                            assessment,
                            objective,
                            plan,
                            subjective,
                            jsonResponse,
                            rosText,
                            jsonStr,
                            newassessment,
                            appointments,
                            chiefcomplaint,
                            history,
                            newplan,
                            prescription,
                            vitals,
                        })
                    );
                console.log(JSON.parse($store));
                document.getElementById("errorDiv").style.display = "none";
                //document.getElementById("errorDivNoConsent").style.display = "none";
                document.getElementById("loadingDiv").style.display="none";
                document.getElementById("successDiv").style.display="block";
            }
        }
    };
});
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
function splitTextForSOAP(text){
    console.log(typeof(text))
    if(text){
        text = String(text);
        console.log("text = ", text);
        text = text.replaceAll(',-','\n')
        text = text.replaceAll('- ','')
        console.log("text after = ", text);
    }
    return text;
}

function runSpeechRecog(){
        var transcript;
        //document.getElementById("output").innerHTML = "Loading text...";
        let recognization = new webkitSpeechRecognition();
        // recognization.onstart = () => {
        //    action.innerHTML = "Listening...";
        // }
        recognization.onresult = (e) => {
           transcript = e.results[0][0].transcript;
        //    output.innerHTML = transcript;
        //    output.classList.remove("hide")
        //    action.innerHTML = "";
        }
        recognization.start();
        return transcript;
     }
function next() {
    window.location.replace("/Problem_ListV1");
}
function rerecord() {
    window.location.replace("/Recording");
}
function displayButton(){
    document.getElementById("btnMicro1").style.display = "block";
}
function startRecording() {
    loading = true;
    recordingStatus = true;
    document.getElementById("btnMicro").style.display = "none";
    document.getElementById("btnMicro1").style.display = "block";
    //const myTimeout = setTimeout(displayButton, 18000);
    
    startVisualizer();
    document.getElementById("audioController").style.display = "none";
    document.getElementById("startRec").style.display = "none";
    document.getElementById("stopRec").style.display = "block";
    document.getElementById("visualizer").style.display = "block";
    mediaRecorder.start();
}

function startStopRecording() {
    if (recordingStatus) {
        stopRecording();
    } else {
        var startRec = false;
        console.log("inside else");
        var txt = "Hello "+patientName+". Our bot will be taking notes during this session to help us make sure we don’t miss any important details for the documentation purpose. If you wish not to record this session, please inform the doctor now. "
        var utterance = new SpeechSynthesisUtterance(txt);
        window.speechSynthesis.speak(utterance);
        var transcript;
        let recognization = new webkitSpeechRecognition();
        // recognization.interimResults = true;
        // recognization.continuous = true;
        recognization.lang = "en-US";
        recognization.onstart = (e) => {
            console.log("started recording.....")
        }
        recognization.onstop = (e) => {
            console.log("stopped recording.....")
        }
        recognization.onresult = (e) => {
           console.log(e.results)
           var transcript = e.results[0][0].transcript;
           let consent;
           console.log("transcript == > ", transcript);
           //if(transcript.includes("no")){
           if(transcript.includes("no") || transcript.includes("not") || transcript.includes("don't") || transcript.includes("deny") || transcript.includes("refrain") || transcript.includes("stop") ){
              consent = new SpeechSynthesisUtterance("Okay "+patientName+", this encounter will not be recorded.");
           } else {
                startRec = true;
                consent = new SpeechSynthesisUtterance("Thanks "+patientName+" for your consent, this encounter will now be recorded.");
           }
           window.speechSynthesis.speak(consent);
        }
        setTimeout(() => {
           recognization.start();
        }, 13700);
        setTimeout(() => {
            if(startRec){
                startRecording();
            } else{
                // let consent = new SpeechSynthesisUtterance(patientName+", as we couldn't record your consent, this encounter will not be recorded.");
                // window.speechSynthesis.speak(consent);
                next();
            }
        }, 21500);
    }
}
function stopRecording() {
    recordingStatus = false;
    document.getElementById("btnMicro").style.display = "block";
    document.getElementById("btnMicro1").style.display = "none";
    document.getElementById("audioController").style.display = "block";
    document.getElementById("visualizer").style.display = "none";
    document.getElementById("startRec").style.display = "block";
    document.getElementById("stopRec").style.display = "none";
    mediaRecorder.stop();
}

function AudioVisualizer(video, canvas) {
    this.video = video;
    this.canvas = canvas;
    this.mediaRecorder = null;
    this.mediaChunks = [];
    this.recordStartTimestamp = null;
    this.recordTimerId = null;
    this.visualDrawTimer = null;
}

AudioVisualizer.prototype = {
    mediaProps: {
        audio: true,
        video: false,
    },

    start() {
        navigator.mediaDevices
            .getUserMedia({
                audio: true,
                video: false,
            })
            .then((stream) => {
                this.mediaSource = stream;
                //this.video.srcObject = stream;
                this.visualize();
                //this.startRecording();
            })
            .catch((e) => console.log("ERROR", e));
    },

    async visualize() {
        var stream = this.mediaSource;
        if (!stream) return;

        this.stopVisualizer();

        var canvas = this.canvas;
        var WIDTH = canvas.width;
        var HEIGHT = canvas.height;

        var ctx = canvas.getContext("2d");

        var audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        var analyser = audioContext.createAnalyser();
        var dataArray = new Uint8Array(analyser.frequencyBinCount);

        if (stream instanceof Blob) {
            const arrayBuffer = await new Response(stream).arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(
                arrayBuffer
            );
            source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(analyser);
        } else {
            var source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);
        }

        analyser.fftSize = 1024;
        var bufferLength = analyser.fftSize;
        var dataArray = new Uint8Array(bufferLength);

        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        var draw = () => {
            this.visualDrawTimer = requestAnimationFrame(draw);

            analyser.getByteTimeDomainData(dataArray);

            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);

            ctx.lineWidth = 2;
            ctx.strokeStyle = "blue";

            ctx.beginPath();

            var sliceWidth = (WIDTH * 1.0) / bufferLength;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {
                var v = dataArray[i] / 128.0;
                var y = (v * HEIGHT) / 2;

                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }

                x += sliceWidth;
            }

            ctx.lineTo(WIDTH, HEIGHT / 2);
            ctx.stroke();
        };
        draw();
    },

    stopVisualizer() {
        if (this.visualDrawTimer) {
            window.cancelAnimationFrame(this.visualDrawTimer);
            this.visualDrawTimer = null;
        }
    },
};
function startVisualizer() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("visualizer");
    new AudioVisualizer(video, canvas).start();
}
async function createEncounter(e: any){
  var json = e.detail;
  console.log(" JSON --->",json);
  var jsonObj = {
    request: {
              method: "POST",
              url: "Encounter"
            },
    resource: {
        resourceType: "Encounter"
        },
        subject: {
                "reference" : "Patient/"+ehrId
        },
        diagnosis:[
            {
                condition:[
                    {
                        concept:
                        {
                            text:subjective
                        }
                    }
                ]
            }
        ]
    }
    console.log("Updated JSON -->", jsonObj)
    json1 = jsonObj;
}

async function createClinicalImpression(e: any){
  var json = e.detail;
  console.log(" JSON --->",json);
  var jsonObj = {
    request: {
              method: "POST",
              url: "ClinicalImpression"
            },
    resource: {
        resourceType: "ClinicalImpression"
        },
        subject: {
                "reference" : "Patient/"+ehrId
        },
        summary: assessment
    }
    console.log("Updated JSON -->", jsonObj)
    json2 = jsonObj;
}

async function createCondition(e: any){
  var json = e.detail;
  console.log(" JSON --->",json);
  var jsonObj = {
    request: {
              method: "POST",
              url: "Condition"
            },
    resource: {
        resourceType: "RequestGroup"
        },
        subject: {
                "reference" : "Patient/"+ehrId
        },
        code:{
            text: assessment
        }
    }
    console.log("Updated JSON -->", jsonObj)
    json3 = jsonObj;
}

async function createRequestOrchestration(e: any){
  var json = e.detail;
  console.log(" JSON --->",json);
  var jsonObj = {
    request: {
              method: "POST",
              url: "RequestGroup"
            },
    resource: {
        resourceType: "RequestGroup"
        },
        "contained":  [
            {
                "resourceType": "MedicationRequest",
                "id": "medicationrequest-1",
                "intent": "proposal",
                "medicationCodeableConcept": {
                    "text": ""+plan
                },
                "subject": {
                    "reference": "Patient/"+ehrId
        }
            }
        ]
    }
    console.log("Updated JSON -->", jsonObj)
    json4 = jsonObj;

}
function createFinalJson(){
  var jsonObj = {
    resourceType: "Bundle",
    entry: [
            json1, 
            json2,
            json3,
            json4
          ]            
    }
    console.log("Final jsonObj -->", jsonObj)
    finalJson = jsonObj;

    ({
        openehr = "",
        ehrscape = "",
        username = "",
        password = "",
        ehrId = "",
        patientName = "",
        dob = "",
        assessment = "",
        objective = "",
        plan = "",
        subjective  = "",
        jsonResponse = "",
        rosText = "",
        jsonStr = "",
        newassessment = "",
        appointments= "",
        chiefcomplaint= "",
        history= "",
        newplan= "",
        prescription= "",
        vitals= "",
    } = JSON.parse($store) ?? {});
    // jsonResponse = finalJson;
    store.setLocal(
                    JSON.stringify({
                        openehr,
                        ehrscape,
                        username,
                        password,
                        ehrId,
                        patientName,
                        dob,
                        assessment,
                        objective,
                        plan,
                        subjective,
                        jsonResponse,
                        rosText,
                        jsonStr,
                        newassessment,
                        appointments,
                        chiefcomplaint,
                        history,
                        newplan,
                        prescription,
                        vitals,
                    })
                );
            console.log(JSON.parse($store));
}
</script>

<link
rel="stylesheet"
href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
/>
        <div class="rightSection">
            <div class="rightBodySection">
                <div class="row">
                    <div class="col-12 padding-0">
                        <section class="pageHeadSection">
                            Record Encounter
                            <!-- </section>
                            <section class="pageHeadSection"> -->
                            <!-- &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; -->
                            <p class="c">View Review of System
                                <a href="# " data-bs-toggle="modal"
                                    data-bs-target="#review-edit">
                                    <i class="bi bi-pencil-square"></i>
                            </p> 
                        </section>
                        <!-- main body section -->
                        <section class="mainBody">
                            <div class="row">
                                <div class="col-12">
                                    <div class="record-wrap">
                                        <div class="recPlayerBlock">
                                            <div class="recPatientInfo">
                                                <p><b>Patient:</b> {patientName} (<b>DOB:</b> {dob})</p>
                                                <p><b>EHR ID:</b> {ehrId}</p>
                                            </div>
                                            <div class="recBlock">
                                                <img src="conversation.png" width="200" height= 100 alt="conversation"/>
                                                <div id="startRec">
                                                    Click <i class="bi bi-mic-fill"></i> below to record the encounter
                                                </div>
                                                <div id="stopRec" style="display: none;">
                                                    Click <i class="bi bi-mic-fill"></i> below to stop recording
                                                </div>
                                                <div class="audioPlayer">
                                                    <audio controls style="width:100%;" id="audioController" />
                                                    <canvas
                                                        id="visualizer"
                                                        width="800"
                                                        height="50"
                                      
                                                    />
                                                </div>&nbsp;
                                                <button on:click={startStopRecording} id="btnMicro" class="btn mic-btn">
                                                    <i class="fa fa-microphone" />
                                                </button>
                                                <button
                                                    on:click={startStopRecording}
                                                    class="btn mic-btn" data-bs-toggle="modal" 
                                                    id="btnMicro1"
                                                    style="display:none;" data-bs-target="#mic-modal">
                                                    <i class="fa fa-microphone" />
                                                </button>
                                    
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>



   <!-- Modal -->
   <div class="modal fade mic-modal" id="mic-modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-body" id="successDiv" style="display:none;">
                <div class="modal-success" >
                    <i class="bi bi-check-circle-fill"></i>
                    Success
                </div>
                <p>
                    <audio id="player1" controls style="width:100%;"/>
                <p>
                    Audio stream has been processed successfully using AI/ML. <br/>
                    Click on Next button to validate and submit the encounter.
                </p>
                <button id="btnNextPage" class="btn next-btn" on:click={next}> Next </button>
            </div>
            <div class="modal-body" id="errorDiv" style="display:none;">
                <div class="modal-success">
                    <i class="bi bi-exclamation-triangle"></i>
                    Warning
                </div>
                <p >
                    <audio id="player2" controls style="width:100%;"/>
                <p>
                    The AI engine was not able to decipher the conversation.<br/>
                    Please Re-record.
                </p>
                <button id="btnDoNothing" class="btn next-btn" on:click={rerecord}> Re-record Coversation </button>
            </div>
            <!-- <div class="modal-body" id="errorDivNoConsent" style="display:none;">
                <div class="modal-success">
                    <i class="bi bi-exclamation-triangle"></i>
                    Warning
                </div>
                <span id="replaceTxt">                
            </span>
            <button class="btn next-btn" on:click={next}> Next </button>
            </div> -->
            <div class="modal-body" id="loadingDiv">
                <div class="text-center">
                    <div class="spinner-border" role="status">
                      <span class="sr-only">Loading...</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>


<div style="display:none;">
    <mb-fhir-form id="formEncounter" on:mb-submit={createEncounter} >
    <mb-context path="resourceType" bind="Encounter"/>
    <mb-input path="diagnosis[0].condition[0].concept.text" label="Subjective: Problem/Diagnosis"/>
    <mb-hidden path="diagnosis[0].use[0].coding[0].system" label="System" value="http://terminology.hl7.org/CodeSystem/diagnosis-role"/>
    <mb-hidden path="diagnosis[0].use[0].coding[0].code" label="Code" value="cc"/>
    <mb-hidden path="diagnosis[0].use[0].coding[0].display" label="display" value="Chief complaint"/>
    <mb-hidden path="subject.reference" label="Patient ID" value="Patient/{ehrId}"/>
    <mb-hidden path="subject.display" label="Patient ID" value="{patientName}"/>
    <mb-submit>
        <button 
            class="btn custome-btn" id="btn1">
             Submit
        </button>
    </mb-submit>
    </mb-fhir-form>
    <mb-fhir-form id="formClinicalImpression" on:mb-submit={createClinicalImpression} >
    <mb-context path="resourceType" bind="ClinicalImpression"/>
      <mb-input path="description" label="Objective: Clinical description" />
      <mb-hidden path="status" label="Status" value="completed" />
      <mb-hidden path="subject.reference" label="Patient ID" value="Patient/{ehrId}"/>
      <mb-hidden path="subject.display" label="Patient ID" value="{patientName}"/>
      <mb-submit>
        <button 
            class="btn custome-btn" id="btn2">
             Submit
        </button>
    </mb-submit>
    </mb-fhir-form> 
    <mb-fhir-form id="formCondition" on:mb-submit={createCondition} >
    <mb-context path="resourceType" bind="Condition" />
      <mb-input path="code.text" label="Assessment: Comments" />
      <mb-hidden path="subject.reference" label="Patient ID" value="Patient/{ehrId}"/>
      <mb-hidden path="subject.display" label="Patient ID" value="{patientName}"/>
      <mb-submit>
        <button 
            class="btn custome-btn" id="btn3">
             Submit
        </button>
    </mb-submit>
    </mb-fhir-form>  
    <mb-fhir-form id="formRequestOrchestration" on:mb-submit={createRequestOrchestration} >
    <mb-context path="resourceType" bind="RequestGroup"/>
    <!-- <mb-context path="contained[0].resourceType" bind="MedicationRequest"/> -->
    <mb-hidden path="contained[0].resourceType" label="MedicationRequest" value="MedicationRequest"/>
      <mb-input path="contained[0].medicationCodeableConcept.text" label="Plan: Course Description" />
      
      <mb-hidden path="contained[0].id" label="ID" value="medicationrequest-1"/>
      <mb-hidden path="contained[0].intent" label="Intent" value="proposal"/>
      <mb-hidden path="subject.reference" label="Patient ID" value="Patient/{ehrId}"/>
      <mb-hidden path="subject.display" label="Patient ID" value="{patientName}"/>
      <mb-submit>
        <button 
            class="btn custome-btn" id="btn4">
             Submit
        </button>
    </mb-submit>
    </mb-fhir-form> 
</div>