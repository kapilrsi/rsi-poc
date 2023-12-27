<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";
    const options = { day: "2-digit", month: "short", year: "numeric" };
    let selctedDate;
    let openehr,
        ehrscape,
        username,
        password,
        ehrId,
        patientName,
        dob,
        patientId,
        cusultationType;
    let data: any[] = [];
    onMount(async () => {
        ({
            openehr = "",
            ehrscape = "",
            username = "",
            password = "",
            ehrId = "",
            patientName = "",
            dob = "",
            patientId = "",
            cusultationType="",
        } = JSON.parse($store) ?? {});
        // const r = await fhir.get("/Appointment");
        // data = r.data?.entry;
        // console.log("Appointment data -->", data);
        // let date = new Date();
        // const day = date.toLocaleString("default", { day: "2-digit" });
        // const month = date.toLocaleString("default", { month: "2-digit" });
        // const year = date.toLocaleString("default", { year: "numeric" });
        // document.getElementById("appDate").value =
        //     year + "-" + month + "-" + day;
        // selctedDate = date.toDateString();
        // console.log("selctedDate  -->", selctedDate);
                let date = new Date();
        const day = date.toLocaleString("default", { day: "2-digit" });
        const month = date.toLocaleString("default", { month: "2-digit" });
        const year = date.toLocaleString("default", { year: "numeric" });
        document.getElementById("appDate").value =
            year + "-" + month + "-" + day;
        selctedDate = date.toDateString();
        const r = await fhir.get("/Appointment?date="+ year + "-" + month + "-" + day);
        data = r.data?.entry;
        console.log("Appointment data -->", data);
        console.log("selctedDate  -->", selctedDate);
    });
        
    async function generateLink(appointment: {}) {
        const myArray = Object.values(appointment);
        let participant = Object.values(myArray[0])[1].participant[0].actor;
        let consultationType = "General";
        if(Object.values(myArray[0])[1].specialty){
            if(Object.values(myArray[0])[1].specialty[0].coding[0].display == "Medical ophthalmology")
                consultationType = "Ophthalmology";
            else
            consultationType = "General";
        } 
        cusultationType = consultationType;
        const r = await fhir.get("/" + participant.reference);
        patientId = r.data.id;
        ehrId = r.data.identifier[0].value;
        patientName = participant.display;
        store.setLocal(
            JSON.stringify({
                openehr,
                ehrscape,
                username,
                password,
                ehrId,
                patientName,
                dob,
                cusultationType,
            })
        );
        console.log(r);
        getQuestionairDetails();
    }

    // function changeDate() {
    //     console.log(
    //         "function called",
    //         document.getElementById("appDate").value
    //     );
    //     var date = new Date(document.getElementById("appDate").value);
    //     selctedDate = date.toDateString();
    //     console.log("selctedDate  -->", selctedDate);
    // }
    async function changeDate() {
        console.log(
            "function called",
            document.getElementById("appDate").value
        );
        var date = new Date(document.getElementById("appDate").value);
        selctedDate = date.toDateString();
        const r = await fhir.get("/Appointment?date="+ document.getElementById("appDate").value);
        data = r.data?.entry;
        console.log("Appointment data -->", data);
        console.log("selctedDate  -->", document.getElementById("appDate").value);
    }

    async function getQuestionairDetails() {
        console.log("All Appoitment list cosultation type = ", cusultationType);
        console.log("getQuestionairDetails called");
        let data: any[] = [];
        let finalData: any[] = [];
        let rosTextToReplace = "";
        console.log("EHR ID =", ehrId);
        var jsonData = '{"Type":"'+cusultationType+'","Reported_Issues":{';
        var q =
            "select TOP 1 c from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.event_summary.v0] WHERE e/ehr_id/value='" +
            ehrId +
            "' order by c/context/start_time/value DESC";
        var query = { q: q };
        const r = await ehrbase.post("/query/aql", JSON.stringify(query), {
            headers: {
                "Content-Type": "application/json",
            },
        });
        data = r.data?.rows[0];
        const myArray1 = Object.values(r.data);
        let c = 0;
        myArray1.forEach((ele1) => {
            c++;
            if (c == myArray1.length) {
                const myArray2 = Object.values(ele1);
                myArray2.forEach((ele2: any) => {
                    if (typeof ele2 == "object") {
                        if (ele2[0]) {
                            console.log("ele2[0] -- >", ele2[0]);
                            if (ele2[0]._type == "COMPOSITION") {
                                let mapData = new Map();
                                if (ele2[0].content && ele2[0].content[0]) {
                                    console.log(
                                        "ele2[0].content[0] -- >",
                                        ele2[0].content[0]
                                    );
                                    let dateArray = ele2[0].content[0].data;
                                    let finalArray = dateArray.events;
                                    finalArray.forEach((element) => {
                                        let headerName = element.name.value;
                                        jsonData =
                                            jsonData + '"' + headerName + '":[{';
                                        let item = Object.values(
                                            element.data.items
                                        );
                                        rosTextToReplace =
                                            rosTextToReplace +
                                            "<li><b>" +
                                            headerName +
                                            "</b>: ";
                                        item.forEach((itm) => {
                                            let key = itm.name.value;
                                            let val;
                                            if (itm.value) {
                                                val = itm.value.value;
                                            } else {
                                                val = "";
                                            }
                                            if (val != false) {
                                                jsonData =
                                                    jsonData + '"' + key + '":"'+val+'",';
                                                rosTextToReplace =
                                                    rosTextToReplace +
                                                    key  + '":"'+val+'",';
                                            }
                                            mapData.set(key, val);
                                        });
                                        let lastComma =
                                            rosTextToReplace.lastIndexOf(",");
                                        rosTextToReplace =
                                            rosTextToReplace.substring(
                                                0,
                                                lastComma
                                            );
                                        let lastComma1 =
                                            jsonData.lastIndexOf(",");
                                        jsonData = jsonData.substring(
                                            0,
                                            lastComma1
                                        );
                                        jsonData = jsonData + "}],";
                                    });

                                    finalData.push(mapData);
                                }
                            }
                        }
                    }
                });
            }
        });
        let lastComma1 = jsonData.lastIndexOf(",");
        jsonData = jsonData.substring(0, lastComma1);
        jsonData = jsonData + "}}";
        console.log("Basic jsonData -->", jsonData);
        finalData.forEach((element) => {
            element.forEach((value, key) => {
                let key1 = key;
                key1 = key1.toLowerCase().replaceAll(/\s/g, "");
                key1 = key1.replaceAll(/[^a-zA-Z0-9]/g, "");
                if (document.getElementById(key1)) {
                    document
                        .getElementById(key1)
                        .setAttribute("checked", "checked"); //check
                }
            });
        });
        let rosText = rosTextToReplace;
        let jsonStr = jsonData;
        store.setLocal(
            JSON.stringify({
                openehr,
                ehrscape,
                username,
                password,
                ehrId,
                patientName,
                patientId,
                dob,
                rosText,
                jsonStr,
            })  
        );
        console.log(JSON.parse($store));
        window.location.href = "/Recording";
    }
</script>

<div class="rightSection">
    <div class="rightBodySection">
        <div class="row">
            <div class="col-12 padding-0">
                <section class="pageHeadSection">
                    <b>Today's Appointments</b>
                </section>

                <!-- main body section -->
                <section class="mainBody">
                    <div class="row">
                        <div class="col-12">
                            <div class="mb-3 appointmentsWrap">
                                <label for="">Appointment</label>
                                <input
                                    type="date"
                                    id="appDate"
                                    class="form-control"
                                    on:change={changeDate}
                                />
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table tableSection">
                                    <thead>
                                        <tr>
                                            <th scope="col" class="text-center"
                                                >Patient Name</th
                                            >
                                            <th scope="col" class="text-center"
                                                >Appointment Type</th
                                            >   
                                            <th scope="col" class="text-center"
                                                >Appointment Date</th
                                            >
                                            <th scope="col" class="text-center"
                                                >Appointment Time</th
                                            >
                                            <th scope="col" class="text-center"
                                                >Appointment Duration</th
                                            >
                                            <th scope="col" class="text-center"
                                                >Record Encounter</th
                                            >
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#if !(data)}
                                        <tr>No Apponitments</tr>
                                        {/if}
                                        {#if (data)}
                                        {#each data as appointment}
                                            {#if new Date(appointment.resource.requestedPeriod[0].start).toDateString() == selctedDate}
                                                <tr>
                                                    <td class="text-center"
                                                        >{appointment.resource
                                                            .participant[0]
                                                            .actor.display}</td
                                                    >
                                                    {#if appointment.resource.specialty}
                                                    <td class="text-center"
                                                        >{appointment.resource
                                                            .specialty[0]
                                                            .coding[0].display}</td
                                                    >
                                                    {/if}
                                                    {#if !appointment.resource.specialty}
                                                    <td class="text-center"
                                                        >General practice</td
                                                    >
                                                    {/if}
                                                    <td class="text-center"
                                                        >{new Date(
                                                            appointment.resource.requestedPeriod[0].start
                                                        ).toDateString()}</td
                                                    >
                                                    <td class="text-center"
                                                        >{new Date(
                                                            appointment.resource.requestedPeriod[0].start
                                                        ).toLocaleTimeString()}</td
                                                    >
                                                    <td class="text-center"
                                                        >{appointment.resource
                                                            .minutesDuration} minutes</td
                                                    >
                                                    <td class="text-center">
                                                        <a
                                                            href="#"
                                                            on:click={() =>
                                                                generateLink({
                                                                    appointment,
                                                                })}
                                                        >
                                                            <i
                                                                class="bi bi-mic-fill"
                                                            />
                                                        </a>
                                                    </td>
                                                </tr>
                                            {/if}
                                        {/each}
                                        {/if}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
