<script lang="ts">
    import EnvironmentConfig from "./EnvironmentConfig.svelte";
    import FormList from "./FormList.svelte";

	import { onMount } from 'svelte'
    import List from "./List.svelte";

	let media = []
	let mediaRecorder = null;
	onMount(async () => {
		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
		
		mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.ondataavailable = (e) => media.push(e.data)
		mediaRecorder.onstop = function(){
			const audio = document.querySelector('audio');
			const blob = new Blob( media, {'type' : 'audio/ogg; codecs=opus' });
			media = [];
			audio.src = window.URL.createObjectURL(blob);
		}
		
	})
	
	function startRecording(){
		mediaRecorder.start();
	}

	function stopRecording(){
		mediaRecorder.stop();
	}
</script>

<section>
	<h2>Record Coversation</h2>
	<audio controls style="width:auto;"/>
	<button  on:click={startRecording}>Start Recording</button>
	<button on:click={stopRecording}>Stop Recording</button>
</section>

<style>
	section{
		display: flex;
		flex-flow: column;
		width: 600px;
	}
</style>
<FormList />
<EnvironmentConfig />
