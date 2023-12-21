
<script lang="ts">
import { store } from "./localStore";
import { onMount } from "svelte";
import { keycloakurl } from "../fhir";
let openehr, ehrscape, username, password, ehrId, patientName, dob, logouturl;
onMount(async () => {
        ({
            openehr = "",
            ehrscape = "",
            username = "",
            password = "",
            ehrId = "",
            patientName = "",
            dob = "",
            logouturl = "",
        } = JSON.parse($store) ?? {});
        console.log(JSON.parse($store));
        // store.setLocal(JSON.stringify({ openehr, ehrscape, username, password, ehrId, patientName, dob}))
        console.log(JSON.parse($store) ?? {});
        //window.location.replace(keycloakurl+"realms/ehrbase/protocol/openid-connect/logout?clientId=ehrbase-client");
        window.location.replace(logouturl);
    });
</script>
