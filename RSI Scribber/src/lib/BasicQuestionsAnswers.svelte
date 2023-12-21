<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";
    let data: any[] = [];
    let finalData: any[] = [];
    let openehr,
        ehrscape,
        username,
        password,
        ehrId,
        patientName,
        dob,
        assessment,
        objective,
        rosText,
        plan,
        subjective,
        jsonResponse,
        jsonStr,
        newassessment,
        appointments,
        chiefcomplaint,
        history,
        newplan,
        prescription,
        vitals;
    onMount(async () => {
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
            subjective = "",
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
        console.log("Basic -->", JSON.parse($store));
        var q =
            "select TOP 1 c from EHR e CONTAINS COMPOSITION c [openEHR-EHR-COMPOSITION.event_summary.v0] WHERE e/ehr_id/value='" +
            ehrId +
            "' order by c/context/start_time/value DESC";
        // console.log(' q = ', q);
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
                            if (ele2[0]._type == "COMPOSITION") {
                                let mapData = new Map();
                                if (ele2[0].content && ele2[0].content[0]) {
                                    let dateArray = ele2[0].content[0].data;
                                    let finalArray = dateArray.events;
                                    finalArray.forEach((element) => {
                                        let headerName = element.name.value;
                                        let item = Object.values(
                                            element.data.items
                                        );
                                        item.forEach((itm) => {
                                            let key = itm.name.value;
                                            let val;
                                            if (itm.value) {
                                                val = itm.value.value;
                                            } else {
                                                val = "";
                                            }
                                            mapData.set(key, val);
                                        });
                                    });

                                    finalData.push(mapData);
                                }
                            }
                        }
                    }
                });
            }
        });
        finalData.forEach((element) => {
            element.forEach((value, key) => {
                let key1 = key;
                key1 = key1.toLowerCase().replaceAll(/\s/g, "");
                key1 = key1.replaceAll(/[^a-zA-Z0-9]/g, "");
                if (document.getElementById(key1)) {
                    document
                        .getElementById(key1)
                        .setAttribute("checked", "checked"); //check
                    document.getElementById(key1).parentElement.style.display =
                        "block";
                }
            });
        });
    });
</script>

<div class="modal-dialog modal-fullscreen">
    <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Review of System</h5>
            <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
            >
                <i class="bi bi-x-circle-fill" />
            </button>
        </div>
        <div class="modal-body">
            <div class="row">
                <div class="col-md-4">
                    <div class="revSystem-list mb-3">
                        <h4>Head</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="headaches"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="headaches"
                                    >
                                        Headaches
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="headinjury"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="headinjury"
                                    >
                                        Head injury
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>Eye</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="glassesorcontacts"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="glassesorcontacts"
                                    >
                                        Glasses or Contacts
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="changeinvision"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="changeinvision"
                                    >
                                        Change in Vision
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="eyepain"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="eyepain"
                                    >
                                        Eye Pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="doublevision"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="doublevision"
                                    >
                                        Double Vision
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="flashinglights"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="flashinglights"
                                    >
                                        Flashing Lights
                                    </label>
                                </div>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="glaucomaorcataract"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="glaucomaorcataract"
                                    >
                                        Glaucoma or Cataract
                                    </label>
                                </div>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="lasteyeexam"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="lasteyeexam"
                                    >
                                        Last Eye Exam
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>MOUTH/THROAT</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="bleedinggum"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="bleedinggum"
                                    >
                                        Bleeding gums
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="soretongue"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="soretongue"
                                    >
                                        Sore tongue
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="sorethroat"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="sorethroat"
                                    >
                                        Sore throat
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="hoarseness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="hoarseness"
                                    >
                                        Hoarseness
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>EARS</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="earpain"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="earpain"
                                    >
                                        Ear pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="eardischarge"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="revCheck5"
                                    >
                                        Ear Discharge
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="ringing"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="ringing"
                                    >
                                        Ringing
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="dizziness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="dizziness"
                                    >
                                        Dizziness
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>NOSE/SINUSES</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="nosebleeds"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="nosebleeds"
                                    >
                                        Nose bleeds
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="nasalstuffiness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="nasalstuffiness"
                                    >
                                        Nasal stuffiness
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="frequentcolds"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="frequentcolds"
                                    >
                                        Frequent colds
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>NECK</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="necklumps"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="necklumps"
                                    >
                                        Neck Lumps
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="swollenglands"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="swollenglands"
                                    >
                                        Swollen glands
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="goiter"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="goiter"
                                    >
                                        Goiter
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="stiffness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="stiffness"
                                    >
                                        Stiffness
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="revSystem-list mb-3">
                        <h4>ALLERGIES</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="revCheck4"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="revCheck4"
                                    >
                                        Hives
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="swellingoflipsortongue"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="swellingoflipsortongue"
                                    >
                                        Swelling of lips or tongue
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="hayfever"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="hayfever"
                                    >
                                        Hay fever
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="asthma"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="asthma"
                                    >
                                        Asthma
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="eczemasensitive"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="eczemasensitive"
                                    >
                                        Eczema/Sensitive
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="sensitivitytodrugsfoodpollensordander"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="sensitivitytodrugsfoodpollensordander"
                                    >
                                        Sensitivity to drugs, food, pollens, or
                                        dander
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>Skin</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="rashes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="rashes"
                                    >
                                        Rashes
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="itching"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="itching"
                                    >
                                        Itching
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="changeinhairornails"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="changeinhairornails"
                                    >
                                        Change in hair or nails
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>ENDOCRINE</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="abnormalgrowth"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="abnormalgrowth"
                                    >
                                        Abnormal growth
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="increasedappetite"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="increasedappetite"
                                    >
                                        Increased appetite
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="increasedthirst"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="increasedthirst"
                                    >
                                        Increased thirst
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="increasedurineproduction"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="increasedurineproduction"
                                    >
                                        Increased urine production
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="thyroidtrouble"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="thyroidtrouble"
                                    >
                                        Thyroid trouble
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="heatcoldintolerance"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="heatcoldintolerance"
                                    >
                                        Heat/cold intolerance
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="excessivesweating"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="excessivesweating"
                                    >
                                        Excessive sweating
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="diabetes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="diabetes"
                                    >
                                        Diabetes
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="revSystem-list mb-3">
                        <h4>GASROINTESTINAL</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="changeofappetiteorweight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="changeofappetiteorweight"
                                    >
                                        Change of appetite or Weight
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="problemswallowing"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="problemswallowing"
                                    >
                                        Problem swallowing
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="nausea"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="nausea"
                                    >
                                        Nausea
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="heartburn"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="heartburn"
                                    >
                                        Heartburn
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="vomiting"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="vomiting"
                                    >
                                        Vomiting
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="vomitingblood"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="vomitingblood"
                                    >
                                        Vomiting blood
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="constipation"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="constipation"
                                    >
                                        Constipation
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="diarrhea"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="diarrhea"
                                    >
                                        Diarrhea
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="changeinbowelhabits"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="changeinbowelhabits"
                                    >
                                        Change in bowel habits
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="abdominalpain"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="abdominalpain"
                                    >
                                        Abdominal pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="excessivebelching"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="excessivebelching"
                                    >
                                        Excessive belching
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="excessiveflatus"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="excessiveflatus"
                                    >
                                        Excessive flatus
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="revCheck5"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="yellowcolorofskinjaundicehepatitis"
                                    >
                                        Yellow color of skin
                                        (jaundice/hepatitis)
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="foodintolerance"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="foodintolerance"
                                    >
                                        Food intolerance
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="rectalbleedinghemorrhoids"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="rectalbleedinghemorrhoids"
                                    >
                                        Rectal bleeding/ Hemorrhoids
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>RESPIRATORY/CARDIAC</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="shortnessofbreath"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="shortnessofbreath"
                                    >
                                        Shortness of breath
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="cough"
                                    />
                                    <label class="form-check-label" for="cough">
                                        Cough
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="productionofphlegmcolor"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="productionofphlegmcolor"
                                    >
                                        Production of phlegm, color
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="wheezing"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="wheezing"
                                    >
                                        Wheezing
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="coughingupblood"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="coughingupblood"
                                    >
                                        Coughing up blood
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="chestpain"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="chestpain"
                                    >
                                        Chest pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="fever"
                                    />
                                    <label class="form-check-label" for="fever">
                                        Fever
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="nightsweats"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="nightsweats"
                                    >
                                        Night sweats
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="swellinginhandsfeet"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="swellinginhandsfeet"
                                    >
                                        Swelling in hands/feet
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="bluefingerstoes"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="bluefingerstoes"
                                    >
                                        Blue fingers/toes
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="highbloodpressure"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="highbloodpressure"
                                    >
                                        High blood pressure
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="skippingheartbeats"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="skippingheartbeats"
                                    >
                                        Skipping heart beats
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="heartmurmur"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="heartmurmur"
                                    >
                                        Heart murmur
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="hxofheartmedication"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="hxofheartmedication"
                                    >
                                        HX of heart Medication
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="bronchitisemphysema"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="bronchitisemphysema"
                                    >
                                        Bronchitis/emphysema
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="rheumaticheartdisease"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="rheumaticheartdisease"
                                    >
                                        Rheumatic heart disease
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>Musculoskeletal</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="pain"
                                    />
                                    <label class="form-check-label" for="pain">
                                        Pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="swelling"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="swelling"
                                    >
                                        Swelling
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="revCheck5"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="revCheck5"
                                    >
                                        Stiffness
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="decreasedjointmotion"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="decreasedjointmotion"
                                    >
                                        Decreased joint motion
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="brokenbone"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="brokenbone"
                                    >
                                        Broken bone
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="serioussprains"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="serioussprains"
                                    >
                                        Serious sprains
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="arthritis"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="arthritis"
                                    >
                                        Arthritis
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="gout"
                                    />
                                    <label class="form-check-label" for="gout">
                                        Gout
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="col-md-4">
                    <div class="revSystem-list mb-3">
                        <h4>BREAST</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="lumps"
                                    />
                                    <label class="form-check-label" for="lumps">
                                        Lumps
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="breastpain"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="breastpain"
                                    >
                                        Breast Pain
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="nippledischarge"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="nippledischarge"
                                    >
                                        Nipple discharge
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="bse"
                                    />
                                    <label class="form-check-label" for="bse">
                                        BSE
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>PERIPHERAL VASCULAR</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="legcramps"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="legcramps"
                                    >
                                        Leg cramps
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="varicoseveins"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="varicoseveins"
                                    >
                                        Varicose veins
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="clotsinveins"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="clotsinveins"
                                    >
                                        Clots in veins
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="decreasedurinestream"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="decreasedurinestream"
                                    >
                                        Decreased urine stream
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="bloodinurineutistonesprostateinfection"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="bloodinurineutistonesprostateinfection"
                                    >
                                        Blood in urine UTI/stones/prostate
                                        infection
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>HEMATOLOGIC</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="anemia"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="anemia"
                                    >
                                        Anemia
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="easybruisingbleeding"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="easybruisingbleeding "
                                    >
                                        Easy bruising/bleeding
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="pasttransfusions"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="pasttransfusions"
                                    >
                                        Past Transfusions
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>URINARY</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="difficultyinurination"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="difficultyinurination"
                                    >
                                        Difficulty in urination
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="painorburningonurination"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="painorburningonurination"
                                    >
                                        Pain or burning on urination
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="frequenturinationatnight"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="frequenturinationatnight"
                                    >
                                        Frequent urination at night
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="urgentneedtourinate"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="urgentneedtourinate"
                                    >
                                        Urgent need to urinate
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="incontinenceofurine"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="incontinenceofurine"
                                    >
                                        Incontinence of urine
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="dribbling"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="dribbling"
                                    >
                                        Dribbling
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div class="revSystem-list mb-3">
                        <h4>NEUROLOGIC</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="headaches"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="headaches"
                                    >
                                        Headaches
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="seizures"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="seizures"
                                    >
                                        Seizures
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="lossofconsciousnessfainting"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="lossofconsciousnessfainting"
                                    >
                                        Loss of Consciousness/Fainting
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="paralysis"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="paralysis"
                                    >
                                        Paralysis
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="weakness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="weakness"
                                    >
                                        Weakness
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="lossofmusclesize"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="lossofmusclesize"
                                    >
                                        Loss of muscle size
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="musclespasm"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="musclespasm"
                                    >
                                        Muscle spasm
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="tremor"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="tremor"
                                    >
                                        Tremor
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="involuntarymovement"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="involuntarymovement"
                                    >
                                        Involuntary movement
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="incoordination"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="incoordination"
                                    >
                                        Incoordination
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="numbness"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="numbness"
                                    >
                                        Numbness
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="feelingofpinsandneedlestingles"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="feelingofpinsandneedlestingles"
                                    >
                                        Feeling of “pins and needles/tingles”
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div class="revSystem-list mb-3">
                        <h4>PSYCHIATRIC</h4>
                        <ul>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="tensionnnxiety"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="tensionnnxiety"
                                    >
                                        Tension/Anxiety
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="depressionsuicideideation"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="depressionsuicideideation"
                                    >
                                        Depression/suicide ideation
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="memoryproblems"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="memoryproblems"
                                    >
                                        Memory problems
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="unusualproblems"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="unusualproblems"
                                    >
                                        Unusual problems
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="sleepproblems"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="sleepproblems"
                                    >
                                        Sleep problems
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="pasttreatmentwithpsychiatrist"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="pasttreatmentwithpsychiatrist"
                                    >
                                        Past treatment with Psychiatrisp
                                    </label>
                                </div>
                            </li>
                            <li>
                                <div class="form-check" style="display:none;">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        value=""
                                        id="changeinmoodchangeinattitudetowardsfamilyfriends"
                                    />
                                    <label
                                        class="form-check-label"
                                        for="changeinmoodchangeinattitudetowardsfamilyfriends"
                                    >
                                        Change in mood/change in attitude
                                        towards family/friends
                                    </label>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
