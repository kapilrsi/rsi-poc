<script lang="ts">
    import { fhir, ehrbase } from "../fhir";
    import { onMount } from "svelte";
    import { store } from "./localStore";
    let openehr, ehrscape, username, password, ehrId, patientName, dob, currentOption;
    let data: any[] = [];
    onMount(async () => {
        const r = await fhir.get("/Patient");
        data = r.data?.entry;
        console.log(data);
        data.forEach((element) => {
            console.log("TEST -->", element[0]);
        });
        ({
            openehr = "",
            ehrscape = "",
            username = "",
            password = "",
            ehrId = "",
            patientName = "",
            dob = "",
            currentOption = "",
        } = JSON.parse($store) ?? {});
    });
    async function handleSubmit(patient: {}) {
        console.log("function called : ", patient);
        const myArray = Object.values(patient);
        var patientName = Object.values(myArray[0])[1].name[0].given;
        var dob = Object.values(myArray[0])[1].birthDate;
        var ehrId = Object.values(myArray[0])[1].identifier[0].value;
        var patientId = Object.values(myArray[0])[1].id;
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
                patientId,
                currentOption,
            })
        );
        console.log("Saved.");
    }
</script>

<div class="rightSection">
    <div class="rightBodySection">
        <div class="row">
            <div class="col-12 padding-0">
                <section class="pageHeadSection">View Patients</section>

                <!-- main body section -->
                <section class="mainBody">
                    <div class="row">
                        <div class="col-12">
                            <b
                                >Select patient to schedule an encounter or <a
                                    href="/Patient_Registration"
                                    >add a new patient</a
                                ></b
                            >
                        </div>
                        <div class="col-12">
                            <div class="table-responsive">
                                <table class="table tableSection">
                                    <thead>
                                        <tr>
                                            <th scope="col">Name</th>
                                            <th scope="col">DOB</th>
                                            <th scope="col">Gender</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">EHR Id</th>
                                            <th scope="col">Patient Id</th>
                                            <th scope="col"
                                                >Schedule Encounter</th
                                            >
                                        </tr>
                                        {#each data as patient}
                                            <tr style="text-align:left;">
                                                <td
                                                    >{patient.resource.name[0]
                                                        ?.given}</td
                                                >
                                                <td
                                                    >{patient.resource
                                                        .birthDate}
                                                </td>
                                                <td
                                                    >{patient.resource.gender}
                                                </td>
                                                <td
                                                    >{patient.resource
                                                        .telecom[0]?.value}
                                                </td>
                                                <td
                                                    >{patient.resource
                                                        .identifier[0]?.value}
                                                </td>
                                                <td>{patient.resource.id} </td>
                                                <td class="text-center">
                                                    <a
                                                        href="/Schedule"
                                                        on:click={() =>
                                                            handleSubmit({
                                                                patient,
                                                            })}
                                                    >
                                                        <i
                                                            class="bi bi-calendar"
                                                        />
                                                    </a>
                                                </td>
                                            </tr>
                                        {/each}
                                    </thead>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    </div>
</div>
