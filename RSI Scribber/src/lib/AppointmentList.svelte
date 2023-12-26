<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";
    import { store } from "./localStore";
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
            cusultationType ="",
        } = JSON.parse($store) ?? {});
        const params = new URLSearchParams([["patient", patientId]]);
        const r = await fhir.get("/Appointment", { params });
        data = r.data?.entry;
        console.log("Return ----->", data);
        data.forEach((element) => {
            console.log("TEST -->", element);
        });
    });
    async function handleSubmit(patient: {}) {
        console.log("function called : ", patient);
        const myArray = Object.values(patient);
        var patientName = Object.values(myArray[0])[1].name[0].given;
        var dob = Object.values(myArray[0])[1].birthDate;
        var ehrId = Object.values(myArray[0])[1].identifier[0].value;
        console.log(ehrId);
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
        console.log("Saved.");
    }
</script>

<main>
    <mb-form class="flex flex-col gap-3 p-5 shadow-lg rounded-lg border-4">
        <h1 style="font-weight: bold;">Appointment List for {patientName}</h1>
        <table>
            <tr style="text-align:left;background-color:#598B8D; color:white;">
                <th>Patient Name</th>
                <th>Appointment Start</th>
                <th>Appointment End</th>
                <th>Duration</th>
                <th>Action</th>
            </tr>
            {#each data as appointment}
                <tr style="text-align:left;">
                    <td>{appointment.resource.participant[0].actor.display}</td>
                    <td>{appointment.resource.requestedPeriod[0].start}</td>
                    <td>{appointment.resource.requestedPeriod[0].end}</td>
                    <td>{appointment.resource.minutesDuration} minute</td>
                    <td>
                        <Link to="/Recording">Record Encounter</Link>
                    </td>
                </tr>
            {/each}
        </table>
    </mb-form>
</main>
